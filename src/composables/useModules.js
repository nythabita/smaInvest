import { ref } from 'vue'
import { supabase } from '../supabase/client'

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
      const { data, error: err } = await supabase
        .from('modules')
        .select('*')
        .order('order_number', { ascending: true })

      if (err) throw err
      modules.value = (data || []).map(mapModule)
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
        // Fallback to order_number if it's a simple number (e.g. from static dashboard links)
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
