import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Store signup data temporarily
let pendingSignupData = null;

// Helper function to add profile to Qdrant
const addProfileToQdrant = async (profile) => {
  try {
    const response = await fetch(`${API_URL}/add_profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error('Failed to add profile to Qdrant');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding profile to Qdrant:', error);
    throw error;
  }
};

// Helper function to update profile in Qdrant
export const updateProfileInQdrant = async (profile) => {
  try {
    console.log('Sending update to Qdrant:', profile);
    
    const response = await fetch(`${API_URL}/update_profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    const data = await response.json();
    console.log('Qdrant update response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile in Qdrant');
    }

    return data;
  } catch (error) {
    console.error('Error updating profile in Qdrant:', error);
    throw error;
  }
};

export const initiateSignUp = async (phone, fullName, dateOfBirth, photo, service_city) => {
  try {
    // Store the signup data for later use
    pendingSignupData = {
      phone,
      fullName,
      dateOfBirth,
      photo,
      service_city
    };

    // Send OTP to the phone number
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        channel: 'sms'
      }
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error in initiateSignUp:', error);
    // Clear pending data on error
    pendingSignupData = null;
    throw error;
  }
};

export const verifyOTP = async (phone, token) => {
  try {
    if (!pendingSignupData) {
      throw new Error('No pending signup data found. Please start the signup process again.');
    }

    // Verify the OTP
    const { data: authData, error: authError } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    });
    
    if (authError) throw authError;

    // Add profile to backend
    await addProfileToQdrant({
      profile_id: authData.user.id,
      phone_number: pendingSignupData.phone,
      full_name: pendingSignupData.fullName,
      date_of_birth: pendingSignupData.dateOfBirth,
      service_city: pendingSignupData.service_city,
      service_area: null,
      service_description: null
    });

    // Clear the pending signup data after successful profile creation
    pendingSignupData = null;
    
    return authData;
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    throw error;
  }
};

export const signIn = async (phone) => {
  try {
    // Send OTP
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        channel: 'sms' // or 'whatsapp' based on user preference
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in signIn:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear any stored data
    localStorage.removeItem('user');
    
    // Navigate to home page
    window.location.href = '/';
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};

export const getSession = () => supabase.auth.getSession();

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

// Helper function to get the current user's profile
export const getCurrentProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const response = await fetch(`${API_URL}/get_profile?profile_id=${user.id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data.profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
