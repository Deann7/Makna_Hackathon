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
      
      if (identifier?.id) {
        query = query.eq('id', identifier.id);
      } else if (identifier?.email) {
        query = query.eq('email', identifier.email);
      } else {
        return null;
      }
      
      const { data, error } = await query.single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error fetching profile:', error);
        }
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
          const userProfile = await fetchProfile({ id: session.user.id });
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
          const userProfile = await fetchProfile({ id: session.user.id });
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // Sign in with Supabase Auth
  const signIn = async (email, password) => {
    try {
      // Clear any existing session first
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), // Normalize email
        password,
      });
      
      if (error) {
        console.error('SignIn error:', error);
        return { data: null, error };
      }
      
      // Fetch profile after successful auth
      if (data.user) {
        const userProfile = await fetchProfile({ id: data.user.id });
        setProfile(userProfile);
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('SignIn catch error:', err);
      return { data: null, error: { message: 'Failed to sign in' } };
    }
  };

  // Sign up with Supabase Auth and auto-create profile via trigger
  const signUp = async (email, password, firstname, lastname = null) => {
    try {
      // Create user with metadata for trigger - NEVER include password in metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstname,
            lastname,
            // ❌ REMOVED password from metadata for security
          }
        }
      });

      if (authError) return { data: null, error: authError };

      // Profile will be created automatically by trigger
      // Wait a moment for trigger to execute
      if (authData.user) {
        // Give trigger time to execute
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fetch the created profile
        const userProfile = await fetchProfile({ id: authData.user.id });
        if (userProfile) {
          setProfile(userProfile);
        }
        
        return { data: authData.user, error: null };
      }

      return { data: null, error: { message: 'Failed to create user' } };
    } catch (err) {
      console.error('SignUp error:', err);
      return { data: null, error: { message: 'Failed to sign up' } };
    }
  };

  // registerUser tidak dipakai lagi
  const registerUser = async () => ({ data: null, error: { message: 'Not implemented' } });

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      return { error };
    } catch (err) {
      return { error: err };
    }
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
