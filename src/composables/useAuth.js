import { ref } from 'vue'
import { supabase } from '../supabase/client'

const user = ref(null)
const session = ref(null)
const loading = ref(false)
const isInitialized = ref(false)

let resolveInit
const initPromise = new Promise((resolve) => {
  resolveInit = resolve
})

// Set up global listener for auth state change
supabase.auth.onAuthStateChange((event, currentSession) => {
  session.value = currentSession
  user.value = currentSession?.user || null
  isInitialized.value = true
  resolveInit()
})

// Initialize session immediately on import
supabase.auth.getSession().then(({ data }) => {
  session.value = data.session
  user.value = data.session?.user || null
  isInitialized.value = true
  resolveInit()
})

export function useAuth() {
  const getSession = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      session.value = data.session
      user.value = data.session?.user || null
      return data.session
    } catch (err) {
      console.error('Error getting session:', err.message)
      return null
    } finally {
      loading.value = false
    }
  }

  const signUpWithEmail = async (email, password) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) throw error
      return data
    } catch (err) {
      console.error('Error signing up:', err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const loginWithEmail = async (email, password) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      session.value = data.session
      user.value = data.user
      return data
    } catch (err) {
      console.error('Error logging in:', err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      user.value = null
      session.value = null
    } catch (err) {
      console.error('Error logging out:', err.message)
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    session,
    loading,
    isInitialized,
    initPromise,
    getSession,
    signUpWithEmail,
    loginWithEmail,
    logout
  }
}
