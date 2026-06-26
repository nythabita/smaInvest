import { ref } from 'vue'
import { supabase } from '../supabase/client'
import { useAuth } from './useAuth'

export function useProfile() {
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchProfile = async (userId) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (err) throw err
      profile.value = data
      return data
    } catch (err) {
      console.error('Error fetching profile:', err.message)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  const createProfile = async (userId, displayName, grade) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('user_profiles')
        .insert([
          { 
            id: userId, 
            display_name: displayName, 
            grade: grade,
            role_title: 'Siswa Investor',
            total_xp: 0,
            achievements: []
          }
        ])
        .select()
        .single()
        
      if (err) throw err
      profile.value = data
      return data
    } catch (err) {
      console.error('Error creating profile:', err.message)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (userId, updates) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
        
      if (err) throw err
      profile.value = data
      return data
    } catch (err) {
      console.error('Error updating profile:', err.message)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    fetchProfile,
    createProfile,
    updateProfile
  }
}
