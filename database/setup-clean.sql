-- MAKNA Heritage Site Trip System Database Schema
-- This schema supports QR scanning, trip tracking, and badge system

-- Drop existing profiles table and recreate with new structure
DROP TABLE IF EXISTS public.profile_badges CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create updated profiles table with new fields
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  firstname text NOT NULL,
  lastname text NOT NULL,
  password text NOT NULL,
  username text UNIQUE CHECK (char_length(username) >= 3),
  avatar_url text,
  phone_number text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable insert for authentication" ON public.profiles FOR INSERT WITH CHECK (true);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, firstname, lastname, password, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'firstname', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'lastname', 'Name'),
    COALESCE(NEW.raw_user_meta_data->>'password', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', LOWER(COALESCE(NEW.raw_user_meta_data->>'firstname', 'user') || '_' || COALESCE(NEW.raw_user_meta_data->>'lastname', 'name')))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Situs table (heritage sites)
CREATE TABLE IF NOT EXISTS public.situs (
  uid uuid NOT NULL DEFAULT uuid_generate_v4(),
  nama_situs character varying NOT NULL,
  lokasi_daerah character varying NOT NULL,
  informasi_situs text,
  tahun_dibangun integer,
  qr_code_data text UNIQUE, -- QR code data for scanning
  estimated_duration_minutes integer DEFAULT 60, -- Estimated trip duration
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT situs_pkey PRIMARY KEY (uid)
);

-- Bangunan situs table with sequence order
CREATE TABLE IF NOT EXISTS public.bangunan_situs (
  uid uuid NOT NULL DEFAULT uuid_generate_v4(),
  nama_bangunan character varying NOT NULL,
  situs_uid uuid NOT NULL,
  jenis_bangunan character varying,
  kondisi character varying,
  deskripsi text,
  urutan_kunjungan integer NOT NULL DEFAULT 1, -- Order of visit in the trip
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT bangunan_situs_pkey PRIMARY KEY (uid),
  CONSTRAINT fk_situs_uid FOREIGN KEY (situs_uid) REFERENCES public.situs(uid) ON DELETE CASCADE
);

-- Badges table
CREATE TABLE IF NOT EXISTS public.badges (
  uid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  situs_uid uuid NOT NULL,
  badge_title VARCHAR NOT NULL,
  badge_info TEXT,
  badge_image_url text,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_badges_situs FOREIGN KEY (situs_uid)
    REFERENCES public.situs(uid)
    ON DELETE CASCADE
);

-- User trips table (tracking active and completed trips)
CREATE TABLE public.user_trips (
  uid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL,
  situs_uid uuid NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  total_buildings integer DEFAULT 0,
  visited_buildings integer DEFAULT 0,
  
  CONSTRAINT fk_user_trips_profile FOREIGN KEY (profile_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_user_trips_situs FOREIGN KEY (situs_uid)
    REFERENCES public.situs(uid)
    ON DELETE CASCADE,
    
  CONSTRAINT unique_active_trip UNIQUE (profile_id, situs_uid, status)
);

-- Building visits tracking table
CREATE TABLE public.building_visits (
  uid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_uid uuid NOT NULL,
  bangunan_uid uuid NOT NULL,
  visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes text,
  
  CONSTRAINT fk_building_visits_trip FOREIGN KEY (trip_uid)
    REFERENCES public.user_trips(uid)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_building_visits_bangunan FOREIGN KEY (bangunan_uid)
    REFERENCES public.bangunan_situs(uid)
    ON DELETE CASCADE,
    
  CONSTRAINT unique_trip_building UNIQUE (trip_uid, bangunan_uid)
);

-- Profile badges table (earned badges)
CREATE TABLE public.profile_badges (
  uid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL,
  badge_id uuid NOT NULL,
  trip_uid uuid, -- Reference to the trip that earned this badge
  jumlah INTEGER DEFAULT 1 CHECK (jumlah >= 0),
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_profile_badges_profile FOREIGN KEY (profile_id)
    REFERENCES public.profiles(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_profile_badges_badge FOREIGN KEY (badge_id)
    REFERENCES public.badges(uid)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_profile_badges_trip FOREIGN KEY (trip_uid)
    REFERENCES public.user_trips(uid)
    ON DELETE SET NULL,

  CONSTRAINT unique_profile_badge UNIQUE (profile_id, badge_id)
);

-- Indexes for better performance
CREATE INDEX idx_user_trips_profile_status ON public.user_trips(profile_id, status);
CREATE INDEX idx_building_visits_trip ON public.building_visits(trip_uid);
CREATE INDEX idx_bangunan_situs_urutan ON public.bangunan_situs(situs_uid, urutan_kunjungan);
CREATE INDEX idx_situs_qr_code ON public.situs(qr_code_data);

-- Functions for trip management

-- Function to start a new trip
CREATE OR REPLACE FUNCTION start_trip(
  p_profile_id uuid,
  p_qr_code_data text
)
RETURNS TABLE(
  trip_uid uuid,
  situs_info jsonb,
  total_buildings integer
) AS $$
DECLARE
  v_situs_uid uuid;
  v_trip_uid uuid;
  v_building_count integer;
  v_situs_data jsonb;
BEGIN
  -- Find situs by QR code
  SELECT uid INTO v_situs_uid 
  FROM public.situs 
  WHERE qr_code_data = p_qr_code_data;
  
  IF v_situs_uid IS NULL THEN
    RAISE EXCEPTION 'Invalid QR code or situs not found';
  END IF;
  
  -- Check if user already has an active trip for this situs
  IF EXISTS (
    SELECT 1 FROM public.user_trips 
    WHERE profile_id = p_profile_id 
    AND situs_uid = v_situs_uid 
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'User already has an active trip for this situs';
  END IF;
  
  -- Count total buildings in situs
  SELECT COUNT(*) INTO v_building_count
  FROM public.bangunan_situs
  WHERE situs_uid = v_situs_uid;
  
  -- Create new trip
  INSERT INTO public.user_trips (profile_id, situs_uid, total_buildings)
  VALUES (p_profile_id, v_situs_uid, v_building_count)
  RETURNING uid INTO v_trip_uid;
  
  -- Get situs information
  SELECT jsonb_build_object(
    'uid', s.uid,
    'nama_situs', s.nama_situs,
    'lokasi_daerah', s.lokasi_daerah,
    'informasi_situs', s.informasi_situs,
    'tahun_dibangun', s.tahun_dibangun,
    'estimated_duration_minutes', s.estimated_duration_minutes
  ) INTO v_situs_data
  FROM public.situs s
  WHERE s.uid = v_situs_uid;
  
  RETURN QUERY SELECT v_trip_uid, v_situs_data, v_building_count;
END;
$$ LANGUAGE plpgsql;

-- Function to visit a building
CREATE OR REPLACE FUNCTION visit_building(
  p_trip_uid uuid,
  p_bangunan_uid uuid,
  p_notes text DEFAULT NULL
)
RETURNS TABLE(
  success boolean,
  visited_count integer,
  total_count integer,
  is_trip_completed boolean,
  badge_earned jsonb
) AS $$
DECLARE
  v_trip_record record;
  v_visited_count integer;
  v_badge_data jsonb := NULL;
BEGIN
  -- Get trip information
  SELECT * INTO v_trip_record
  FROM public.user_trips
  WHERE uid = p_trip_uid AND status = 'active';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Active trip not found';
  END IF;
  
  -- Verify building belongs to the situs
  IF NOT EXISTS (
    SELECT 1 FROM public.bangunan_situs
    WHERE uid = p_bangunan_uid AND situs_uid = v_trip_record.situs_uid
  ) THEN
    RAISE EXCEPTION 'Building does not belong to this situs';
  END IF;
  
  -- Record the visit (will be ignored if already visited due to unique constraint)
  INSERT INTO public.building_visits (trip_uid, bangunan_uid, notes)
  VALUES (p_trip_uid, p_bangunan_uid, p_notes)
  ON CONFLICT (trip_uid, bangunan_uid) DO NOTHING;
  
  -- Count visited buildings
  SELECT COUNT(*) INTO v_visited_count
  FROM public.building_visits
  WHERE trip_uid = p_trip_uid;
  
  -- Update trip progress
  UPDATE public.user_trips
  SET visited_buildings = v_visited_count,
      updated_at = CURRENT_TIMESTAMP
  WHERE uid = p_trip_uid;
  
  -- Check if trip is completed
  IF v_visited_count >= v_trip_record.total_buildings THEN
    -- Complete the trip
    UPDATE public.user_trips
    SET status = 'completed',
        completed_at = CURRENT_TIMESTAMP
    WHERE uid = p_trip_uid;
    
    -- Award badge
    INSERT INTO public.profile_badges (profile_id, badge_id, trip_uid)
    SELECT v_trip_record.profile_id, b.uid, p_trip_uid
    FROM public.badges b
    WHERE b.situs_uid = v_trip_record.situs_uid
    ON CONFLICT (profile_id, badge_id) DO UPDATE SET
      jumlah = profile_badges.jumlah + 1,
      earned_at = CURRENT_TIMESTAMP;
    
    -- Get badge information
    SELECT jsonb_build_object(
      'badge_title', b.badge_title,
      'badge_info', b.badge_info,
      'badge_image_url', b.badge_image_url
    ) INTO v_badge_data
    FROM public.badges b
    WHERE b.situs_uid = v_trip_record.situs_uid;
    
    RETURN QUERY SELECT 
      true, 
      v_visited_count, 
      v_trip_record.total_buildings, 
      true, 
      v_badge_data;
  ELSE
    RETURN QUERY SELECT 
      true, 
      v_visited_count, 
      v_trip_record.total_buildings, 
      false, 
      v_badge_data;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing
INSERT INTO public.situs (nama_situs, lokasi_daerah, informasi_situs, tahun_dibangun, qr_code_data, estimated_duration_minutes) VALUES
('Candi Borobudur', 'Magelang, Jawa Tengah', 'Candi Buddha terbesar di dunia yang dibangun pada abad ke-8', 800, 'BOROBUDUR_QR_2024', 120),
('Candi Prambanan', 'Yogyakarta', 'Kompleks candi Hindu terbesar di Indonesia', 850, 'PRAMBANAN_QR_2024', 90);

INSERT INTO public.bangunan_situs (nama_bangunan, situs_uid, jenis_bangunan, kondisi, deskripsi, urutan_kunjungan) VALUES
((SELECT uid FROM public.situs WHERE nama_situs = 'Candi Borobudur'), 'Gerbang Utama', 'Candi Borobudur', 'Baik', 'Pintu masuk utama ke kompleks Borobudur', 1),
((SELECT uid FROM public.situs WHERE nama_situs = 'Candi Borobudur'), 'Tingkat Kamadhatu', 'Candi Borobudur', 'Baik', 'Tingkat dasar yang melambangkan dunia nafsu', 2),
((SELECT uid FROM public.situs WHERE nama_situs = 'Candi Borobudur'), 'Tingkat Rupadhatu', 'Candi Borobudur', 'Baik', 'Tingkat tengah dengan relief cerita Buddha', 3),
((SELECT uid FROM public.situs WHERE nama_situs = 'Candi Borobudur'), 'Tingkat Arupadhatu', 'Candi Borobudur', 'Baik', 'Tingkat tertinggi dengan stupa utama', 4);

INSERT INTO public.badges (situs_uid, badge_title, badge_info, badge_image_url) VALUES
((SELECT uid FROM public.situs WHERE nama_situs = 'Candi Borobudur'), 'Penjelajah Borobudur', 'Berhasil menyelesaikan perjalanan di Candi Borobudur', '/badges/borobudur-explorer.png'),
((SELECT uid FROM public.situs WHERE nama_situs = 'Candi Prambanan'), 'Penjelajah Prambanan', 'Berhasil menyelesaikan perjalanan di Candi Prambanan', '/badges/prambanan-explorer.png');
