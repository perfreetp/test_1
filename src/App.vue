<script setup>
import { ref, computed } from 'vue'
import { provideActivityStorage } from './composables/useActivityStorage'
import ActivityList from './components/ActivityList.vue'
import ActivityEditor from './components/editor/ActivityEditor.vue'
import ActivityPreview from './components/preview/ActivityPreview.vue'

const storage = provideActivityStorage()

const { currentActivityId, selectActivity, getActivityById } = storage

const currentView = ref('list')
const previewActivityId = ref(null)

const showEditor = computed(() => {
  return currentView.value === 'editor' && currentActivityId.value
})

const showPreview = computed(() => {
  return currentView.value === 'preview' && previewActivityId.value
})

const previewActivity = computed(() => {
  if (!previewActivityId.value) return null
  return getActivityById(previewActivityId.value)
})

const handleSelectActivity = (activityId) => {
  selectActivity(activityId)
  currentView.value = 'editor'
}

const handlePreviewActivity = (activityId) => {
  previewActivityId.value = activityId
  currentView.value = 'preview'
}

const handleBackToList = () => {
  currentView.value = 'list'
  previewActivityId.value = null
}
</script>

<template>
  <ActivityList 
    v-if="currentView === 'list'"
    @selectActivity="handleSelectActivity"
    @previewActivity="handlePreviewActivity"
  />
  
  <ActivityEditor 
    v-else-if="showEditor"
    @backToList="handleBackToList"
  />
  
  <div v-else-if="showPreview && previewActivity" class="preview-page">
    <header class="preview-header">
      <button class="btn btn-outline btn-back" @click="handleBackToList">
        <span class="icon">←</span>
        <span>返回列表</span>
      </button>
      <h1 class="preview-title">活动预览</h1>
      <div class="header-spacer"></div>
    </header>
    <div class="preview-content">
      <ActivityPreview :activity="previewActivity" />
    </div>
  </div>
</template>

<style scoped>
.preview-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.preview-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.preview-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-spacer {
  width: 100px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-outline {
  background: white;
  color: #666;
  border: 1px solid #e0e0e0;
}

.btn-outline:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-back .icon {
  font-size: 16px;
  font-weight: bold;
}

.preview-content {
  padding: 24px;
}

@media (max-width: 640px) {
  .preview-header {
    padding: 12px 16px;
  }
  
  .preview-title {
    font-size: 16px;
  }
  
  .header-spacer {
    display: none;
  }
  
  .btn-back .icon {
    font-size: 18px;
  }
  
  .btn-back span:not(.icon) {
    display: none;
  }
  
  .preview-content {
    padding: 16px;
  }
}
</style>
