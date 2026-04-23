import { ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const STORAGE_KEY = 'activity-editor-data'

export function useActivityStorage() {
  const getDefaultActivity = () => ({
    id: Date.now().toString(),
    name: '新建活动',
    startTime: null,
    endTime: null,
    status: 'draft',
    banners: [],
    products: []
  })

  const defaultActivity = getDefaultActivity()

  const activity = useLocalStorage(STORAGE_KEY, defaultActivity, {
    mergeDefaults: false,
    writeDefaults: true
  })

  const saveActivity = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activity.value))
  }

  const loadActivity = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        activity.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved activity:', e)
      }
    }
  }

  const resetActivity = () => {
    activity.value = getDefaultActivity()
    localStorage.removeItem(STORAGE_KEY)
  }

  watch(activity, () => {
    saveActivity()
  }, { deep: true })

  return {
    activity,
    saveActivity,
    loadActivity,
    resetActivity
  }
}
