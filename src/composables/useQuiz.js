import { ref } from 'vue'
import { supabase } from '../supabase/client'

const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export function useQuiz() {
  const questions = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchQuestionsByModuleId = async (moduleId) => {
    loading.value = true
    error.value = null
    questions.value = []
    try {
      let resolvedModuleId = moduleId
      
      // If the moduleId is not a UUID, we need to find the module by order_number first
      if (!isUUID(moduleId)) {
        const orderNum = parseInt(moduleId, 10)
        if (!isNaN(orderNum)) {
          const { data: modData, error: modErr } = await supabase
            .from('modules')
            .select('id')
            .eq('order_number', orderNum)
            .maybeSingle()
          
          if (modErr) throw modErr
          if (modData) {
            resolvedModuleId = modData.id
          }
        }
      }

      if (!isUUID(resolvedModuleId)) {
        questions.value = []
        return
      }

      const { data, error: err } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('module_id', resolvedModuleId)

      if (err) throw err

      questions.value = (data || []).map(q => ({
        text: q.question,
        options: q.options
      }))
    } catch (err) {
      console.error('Error fetching quiz questions:', err.message)
      error.value = 'Gagal memuat pertanyaan kuis. Silakan coba lagi.'
    } finally {
      loading.value = false
    }
  }

  return {
    questions,
    loading,
    error,
    fetchQuestionsByModuleId
  }
}
