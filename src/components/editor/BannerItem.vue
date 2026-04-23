<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  banner: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update', 'delete', 'move-up', 'move-down'])

const isEditing = ref(false)
const localBanner = ref({ ...props.banner })

const bannerStyle = computed(() => ({
  backgroundImage: `url(${localBanner.value.imageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}))

const startEdit = () => {
  localBanner.value = { ...props.banner }
  isEditing.value = true
}

const saveEdit = () => {
  emit('update', { ...localBanner.value, id: props.banner.id })
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
}

const deleteBanner = () => {
  emit('delete', props.banner.id)
}

const moveUp = () => {
  emit('move-up', props.index)
}

const moveDown = () => {
  emit('move-down', props.index)
}
</script>

<template>
  <div class="banner-item" :class="{ 'editing': isEditing }">
    <div class="banner-preview" v-if="!isEditing">
      <div class="banner-image" :style="bannerStyle">
        <div class="banner-overlay">
          <div class="banner-info">
            <div class="banner-index">{{ index + 1 }}</div>
            <div class="banner-title">{{ banner.title || '未设置标题' }}</div>
          </div>
          <div class="banner-actions">
            <button class="btn-icon" @click="startEdit" title="编辑">
              ✏️
            </button>
            <button class="btn-icon" @click="moveUp" title="上移" :disabled="index === 0">
              ⬆️
            </button>
            <button class="btn-icon" @click="moveDown" title="下移" :disabled="index === -1">
              ⬇️
            </button>
            <button class="btn-icon delete" @click="deleteBanner" title="删除">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="banner-edit" v-else>
      <div class="form-group">
        <label>Banner 图片 URL</label>
        <input 
          type="text" 
          v-model="localBanner.imageUrl" 
          placeholder="输入图片 URL"
        />
      </div>
      <div class="form-group">
        <label>标题</label>
        <input 
          type="text" 
          v-model="localBanner.title" 
          placeholder="输入标题"
        />
      </div>
      <div class="form-group">
        <label>链接</label>
        <input 
          type="text" 
          v-model="localBanner.linkUrl" 
          placeholder="输入跳转链接"
        />
      </div>
      <div class="edit-actions">
        <button class="btn btn-secondary" @click="cancelEdit">取消</button>
        <button class="btn btn-primary" @click="saveEdit">保存</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
}

.banner-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.banner-preview {
  position: relative;
}

.banner-image {
  height: 120px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.banner-image::before {
  content: '图片';
  color: #999;
  font-size: 14px;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5));
  color: white;
}

.banner-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.banner-index {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.banner-title {
  font-size: 14px;
  font-weight: 500;
}

.banner-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.4);
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon.delete:hover {
  background: rgba(255, 0, 0, 0.5);
}

.banner-edit {
  padding: 16px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #1890ff;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}
</style>
