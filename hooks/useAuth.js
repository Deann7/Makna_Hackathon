import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Fetch profile by id, username, or email
  const fetchProfile = async (identifier) => {
    try {
      let query = supabase.from('profiles').select('*');
      if (identifier?.id) query = query.eq('id', identifier.id);
      else if (identifier?.username) query = query.eq('username', identifier.username);
      else if (identifier?.email) query = query.eq('email', identifier.email);
      else if (typeof identifier === 'string') {
        // Try as username or email
        query = query.or(`username.eq.${identifier},email.eq.${identifier}`);
      }
      const { data, error } = await query.single();
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // Manual signIn: email/username + password
  const signIn = async (identifier, password) => {
    // identifier: email or username
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.eq.${identifier},email.eq.${identifier}`)
        .single();
      if (error) return { data: null, error };
      // Password check (plaintext, not recommended for production)
      if (!data || data.password !== password) {
        return { data: null, error: { message: 'Username/email atau password salah' } };
      }
      setUser(data);
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: 'Gagal login' } };
    }
  };

  // Manual signUp: insert ke profiles
  const signUp = async (email, password, username, phoneNumber, fullName) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          email,
          password, // plaintext, not recommended for production
          username,
          phone_number: phoneNumber,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) return { data: null, error };
      setUser(data);
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: 'Gagal daftar' } };
    }
  };

  // registerUser tidak dipakai lagi
  const registerUser = async () => ({ data: null, error: { message: 'Not implemented' } });

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    return { error: null };
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: { message: 'User not authenticated' } };
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) return { error };
      
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      return { error: err };
    }
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    registerUser,
    updateProfile,
    fetchProfile,
  };
}
