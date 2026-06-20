import { ref } from 'vue'
import { supabase } from '../supabase/client'
import { useAuth } from './useAuth'

const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

const mapModule = (item) => {
  if (!item) return null
  return {
    ...item,
    keyTakeaway: item.key_takeaway
  }
}

export function useModules() {
  const modules = ref([])
  const currentModule = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchModules = async () => {
    loading.value = true
    error.value = null
    try {
      const { user } = useAuth()
      
      const { data: modulesData, error: err } = await supabase
        .from('modules')
        .select('*')
        .order('order_number', { ascending: true })

      if (err) throw err

      let completedModuleIds = new Set()
      if (user.value) {
        const { data: progressData, error: progErr } = await supabase
          .from('user_progress')
          .select('module_id')
          .eq('user_id', user.value.id)
          .eq('is_completed', true)

        if (!progErr && progressData) {
          completedModuleIds = new Set(progressData.map(p => p.module_id))
        }
      }

      modules.value = (modulesData || []).map(item => {
        const isCompleted = completedModuleIds.has(item.id)
        return {
          ...item,
          keyTakeaway: item.key_takeaway,
          status: isCompleted ? 'completed' : 'not_started',
          progress: isCompleted ? 100 : 0
        }
      })
    } catch (err) {
      console.error('Error fetching modules:', err.message)
      error.value = 'Gagal memuat daftar modul. Silakan coba lagi.'
    } finally {
      loading.value = false
    }
  }

  const fetchModuleById = async (id) => {
    loading.value = true
    error.value = null
    currentModule.value = null
    try {
      let query = supabase.from('modules').select('*')
      
      if (isUUID(id)) {
        query = query.eq('id', id)
      } else {
        const orderNum = parseInt(id, 10)
        if (!isNaN(orderNum)) {
          query = query.eq('order_number', orderNum)
        } else {
          currentModule.value = null
          return
        }
      }

      const { data, error: err } = await query.maybeSingle()

      if (err) throw err
      currentModule.value = mapModule(data)
    } catch (err) {
      console.error('Error fetching module by id:', err.message)
      error.value = 'Gagal memuat detail modul. Silakan coba lagi.'
    } finally {
      loading.value = false
    }
  }

  return {
    modules,
    currentModule,
    loading,
    error,
    fetchModules,
    fetchModuleById
  }
}
