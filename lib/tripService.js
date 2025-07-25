import { supabase } from './supabase';

export class TripService {
  // Debug function to check all situs in database
  static async getAllSitus() {
    try {
      console.log('🔍 Fetching all situs from database...');
      const { data, error } = await supabase
        .from('situs')
        .select('*');

      console.log('📋 All situs in database:', data);
      if (error) console.error('❌ Error fetching situs:', error);
      
      return { success: !error, data, error };
    } catch (error) {
      console.error('💥 Unexpected error in getAllSitus:', error);
      return { success: false, error: error.message };
    }
  }

  // Start a new trip by scanning QR code
  static async startTrip(profileId, qrCodeData) {
    try {
      const { data, error } = await supabase.rpc('start_trip', {
        p_profile_id: profileId,
        p_qr_code_data: qrCodeData
      });

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Visit a building in current trip
  static async visitBuilding(tripId, buildingId, notes = null) {
    try {
      const { data, error } = await supabase.rpc('visit_building', {
        p_trip_uid: tripId,
        p_bangunan_uid: buildingId,
        p_notes: notes
      });

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get user's active trips
  static async getActiveTrips(profileId) {
    try {
      const { data, error } = await supabase
        .from('user_trips')
        .select(`
          *,
          situs:situs_uid (
            uid,
            nama_situs,
            lokasi_daerah,
            informasi_situs,
            estimated_duration_minutes
          )
        `)
        .eq('profile_id', profileId)
        .eq('status', 'active');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get buildings for a trip with visit status
  static async getTripBuildings(tripId, situsId) {
    try {
      const { data, error } = await supabase
        .from('bangunan_situs')
        .select(`
          uid,
          nama_bangunan,
          jenis_bangunan,
          deskripsi,
          urutan_kunjungan,
          latitude,
          longitude,
          building_visits!left (
            uid,
            visited_at,
            notes
          )
        `)
        .eq('situs_uid', situsId)
        .eq('building_visits.trip_uid', tripId)
        .order('urutan_kunjungan');

      if (error) throw error;
      
      // Transform data to include visit status
      const buildingsWithStatus = data.map(building => ({
        ...building,
        is_visited: building.building_visits.length > 0,
        visited_at: building.building_visits[0]?.visited_at || null,
        notes: building.building_visits[0]?.notes || null
      }));

      return { success: true, data: buildingsWithStatus };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get user's earned badges
  static async getUserBadges(profileId) {
    try {
      const { data, error } = await supabase
        .from('profile_badges')
        .select(`
          *,
          badges:badge_id (
            uid,
            badge_title,
            badge_info,
            badge_image_url,
            situs:situs_uid (
              nama_situs,
              lokasi_daerah
            )
          )
        `)
        .eq('profile_id', profileId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get trip history (completed trips)
  static async getTripHistory(profileId) {
    try {
      const { data, error } = await supabase
        .from('user_trips')
        .select(`
          *,
          situs:situs_uid (
            uid,
            nama_situs,
            lokasi_daerah,
            informasi_situs
          )
        `)
        .eq('profile_id', profileId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get available situs for exploration
  static async getAvailableSitus() {
    try {
      const { data, error } = await supabase
        .from('situs')
        .select(`
          uid,
          nama_situs,
          lokasi_daerah,
          informasi_situs,
          tahun_dibangun,
          estimated_duration_minutes,
          image_situs,
          bangunan_count:bangunan_situs(count)
        `)
        .order('nama_situs');

      if (error) throw error;

      // Log the first item to debug image path
      if (data?.length > 0) {
        console.log('First situs image path:', data[0].image_situs);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in getAvailableSitus:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if QR code is valid (QR code contains situs UID)
  static async validateQRCode(qrCodeData) {
    try {
      console.log('🔍 Validating QR Code Data:', qrCodeData);
      
      // QR code should contain the situs UID directly
      const { data, error } = await supabase
        .from('situs')
        .select(`
          uid,
          nama_situs,
          lokasi_daerah,
          informasi_situs,
          tahun_dibangun,
          estimated_duration_minutes
        `)
        .eq('uid', qrCodeData)
        .single();

      console.log('📋 Supabase query result:', { data, error });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Found situs:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ validateQRCode error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Get buildings for a specific situs
  static async getSitusBuildings(situsId) {
    try {
      const { data, error } = await supabase
        .from('bangunan_situs')
        .select(`
          uid,
          nama_bangunan,
          jenis_bangunan,
          kondisi,
          deskripsi,
          urutan_kunjungan,
          latitude,
          longitude
        `)
        .eq('situs_uid', situsId)
        .order('urutan_kunjungan');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
} 