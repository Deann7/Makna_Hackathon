import { supabase } from './supabase';

export class TripService {
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
          bangunan_count:bangunan_situs(count)
        `)
        .order('nama_situs');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Check if QR code is valid
  static async validateQRCode(qrCodeData) {
    try {
      const { data, error } = await supabase
        .from('situs')
        .select(`
          uid,
          nama_situs,
          lokasi_daerah,
          informasi_situs,
          estimated_duration_minutes
        `)
        .eq('qr_code_data', qrCodeData)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
} 