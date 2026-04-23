<script setup>
import { ref, computed } from 'vue'
import { useActivityStorage } from './composables/useActivityStorage'
import ActivityList from './components/ActivityList.vue'
import ActivityEditor from './components/editor/ActivityEditor.vue'

const { hasActivities, currentActivityId, selectActivity } = useActivityStorage()

const currentView = ref('list')

const showEditor = computed(() => {
  return currentView.value === 'editor' && currentActivityId.value
})

const handleSelectActivity = (activityId) => {
  selectActivity(activityId)
  currentView.value = 'editor'
}

const handleBackToList = () => {
  currentView.value = 'list'
}
</script>

<template>
  <ActivityList 
    v-if="currentView === 'list'"
    @selectActivity="handleSelectActivity"
  />
  
  <ActivityEditor 
    v-else-if="showEditor"
    @backToList="handleBackToList"
  />
</template>
