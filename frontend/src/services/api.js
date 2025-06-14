// services/api.js

const API_BASE = 'http://localhost:8000'  // adjust if needed

export const searchProfiles = async (query, sim_threshold = 0.1, top_k = 50) => {
  const response = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, sim_threshold, top_k }),
  })
  if (!response.ok) throw new Error('Search API error')
  return response.json()
}

export const getProfile = async (profile_id) => {
  const response = await fetch(`${API_BASE}/get_profile?profile_id=${profile_id}`)
  if (!response.ok) throw new Error('Get profile error')
  return response.json()
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
