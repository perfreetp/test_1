import { ref, computed, provide, inject, watch, onUnmounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const ACTIVITIES_KEY = 'activity-editor-activities'
const CURRENT_ACTIVITY_ID_KEY = 'activity-editor-current-id'
const ACTIVITY_STORAGE_KEY = Symbol('activity-storage')

let globalStorageInstance = null

export function createActivityStorage() {
  const getDefaultActivity = () => ({
    id: Date.now().toString(),
    name: '新建活动',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startTime: null,
    endTime: null,
    status: 'draft',
    banners: [],
    products: []
  })

  const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj)
    if (Array.isArray(obj)) return obj.map(item => deepClone(item))
    const cloned = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }

  const activities = useLocalStorage(ACTIVITIES_KEY, [], {
    mergeDefaults: false,
    writeDefaults: true
  })

  const currentActivityId = useLocalStorage(CURRENT_ACTIVITY_ID_KEY, null, {
    mergeDefaults: false,
    writeDefaults: true
  })

  const currentActivity = ref(null)

  const loadActivityToRef = () => {
    if (!currentActivityId.value) {
      currentActivity.value = null
      return
    }
    const found = activities.value.find(a => a.id === currentActivityId.value)
    if (found) {
      currentActivity.value = deepClone(found)
    } else {
      currentActivity.value = null
    }
  }

  const saveActivityFromRef = () => {
    if (!currentActivityId.value || !currentActivity.value) return
    const index = activities.value.findIndex(a => a.id === currentActivityId.value)
    if (index !== -1) {
      activities.value[index] = {
        ...deepClone(currentActivity.value),
        updatedAt: new Date().toISOString()
      }
    }
  }

  loadActivityToRef()

  const stopCurrentActivityWatch = watch(
    currentActivity,
    () => {
      saveActivityFromRef()
    },
    { deep: true }
  )

  const stopCurrentActivityIdWatch = watch(
    currentActivityId,
    () => {
      loadActivityToRef()
    }
  )

  const activity = computed({
    get: () => currentActivity.value,
    set: (newValue) => {
      currentActivity.value = newValue ? deepClone(newValue) : null
    }
  })

  const hasActivities = computed(() => activities.value.length > 0)

  const sortedActivities = computed(() => {
    return [...activities.value].sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
  })

  const getActivityById = (activityId) => {
    const found = activities.value.find(a => a.id === activityId)
    return found ? deepClone(found) : null
  }

  const createActivity = (name = '新建活动') => {
    const newActivity = {
      ...getDefaultActivity(),
      name,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    activities.value.push(newActivity)
    currentActivityId.value = newActivity.id
    return deepClone(newActivity)
  }

  const selectActivity = (activityId) => {
    const exists = activities.value.find(a => a.id === activityId)
    if (exists) {
      currentActivityId.value = activityId
      return deepClone(exists)
    }
    return null
  }

  const deleteActivity = (activityId) => {
    const index = activities.value.findIndex(a => a.id === activityId)
    if (index !== -1) {
      activities.value.splice(index, 1)
      if (currentActivityId.value === activityId) {
        currentActivityId.value = activities.value.length > 0 ? activities.value[0].id : null
      }
      return true
    }
    return false
  }

  const duplicateActivity = (activityId) => {
    const source = activities.value.find(a => a.id === activityId)
    if (source) {
      const newActivity = {
        ...deepClone(source),
        id: Date.now().toString(),
        name: `${source.name} (副本)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      activities.value.push(newActivity)
      currentActivityId.value = newActivity.id
      return deepClone(newActivity)
    }
    return null
  }

  const updateActivity = (activityId, updates) => {
    const index = activities.value.findIndex(a => a.id === activityId)
    if (index !== -1) {
      activities.value[index] = {
        ...activities.value[index],
        ...deepClone(updates),
        updatedAt: new Date().toISOString()
      }
      if (currentActivityId.value === activityId && currentActivity.value) {
        currentActivity.value = {
          ...currentActivity.value,
          ...deepClone(updates)
        }
      }
      return true
    }
    return false
  }

  const updateCurrentActivity = (updates) => {
    if (!currentActivityId.value) return false
    return updateActivity(currentActivityId.value, updates)
  }

  const ensureDefaultActivity = () => {
    if (activities.value.length === 0) {
      createActivity('我的第一个活动')
    }
    if (!currentActivityId.value && activities.value.length > 0) {
      currentActivityId.value = activities.value[0].id
    }
  }

  const resetCurrentActivity = () => {
    if (currentActivityId.value) {
      const index = activities.value.findIndex(a => a.id === currentActivityId.value)
      if (index !== -1) {
        const defaultActivity = {
          ...getDefaultActivity(),
          id: currentActivityId.value,
          name: activities.value[index].name || '新建活动',
          createdAt: activities.value[index].createdAt,
          updatedAt: new Date().toISOString()
        }
        activities.value[index] = defaultActivity
        currentActivity.value = deepClone(defaultActivity)
      }
    }
  }

  ensureDefaultActivity()

  const cleanup = () => {
    if (stopCurrentActivityWatch) stopCurrentActivityWatch()
    if (stopCurrentActivityIdWatch) stopCurrentActivityIdWatch()
  }

  const storage = {
    activity,
    activities: sortedActivities,
    hasActivities,
    currentActivityId,
    getActivityById,
    createActivity,
    selectActivity,
    deleteActivity,
    duplicateActivity,
    updateActivity,
    updateCurrentActivity,
    resetCurrentActivity,
    ensureDefaultActivity,
    cleanup
  }

  globalStorageInstance = storage
  return storage
}

export function provideActivityStorage() {
  const storage = createActivityStorage()
  provide(ACTIVITY_STORAGE_KEY, storage)
  
  onUnmounted(() => {
    if (storage && storage.cleanup) {
      storage.cleanup()
    }
  })
  
  return storage
}

export function useActivityStorage() {
  const storage = inject(ACTIVITY_STORAGE_KEY)
  if (storage) {
    return storage
  }
  
  if (globalStorageInstance) {
    return globalStorageInstance
  }
  
  return createActivityStorage()
}
