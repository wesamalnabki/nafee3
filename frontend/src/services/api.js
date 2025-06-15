// services/api.js

import { supabase } from './auth';

const API_BASE = 'http://localhost:8000'  // adjust if needed

export const searchProfiles = async (query, simThreshold = 0.1, topK = 50) => {
  const response = await fetch(`${API_BASE}/search_profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      sim_threshold: simThreshold,
      top_k: topK,
    }),
  })

  return response.json()
}

export const getProfile = async (profile_id) => {
  try {
    if (!profile_id) {
      throw new Error('Profile ID is required');
    }
    
    console.log('Fetching profile for ID:', profile_id);
    const response = await fetch(`${API_BASE}/get_profile?profile_id=${encodeURIComponent(profile_id)}`);
    const data = await response.json();
    console.log('Profile response:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Get profile error');
    }
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

export const updateProfile = async (profile) => {
  const response = await fetch(`${API_BASE}/update_profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  if (!response.ok) throw new Error('Update profile error')
  return response.json()
}

export const addProfile = async (profile) => {
  const response = await fetch(`${API_BASE}/add_profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  if (!response.ok) throw new Error('Add profile error')
  return response.json()
}

// export const updateProfileInQdrant = async (profile) => {
//   try {
//     const response = await fetch(`${API_BASE}/update_profile`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(profile),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to update profile in Qdrant');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error updating profile in Qdrant:', error);
//     throw error;
//   }
// };
