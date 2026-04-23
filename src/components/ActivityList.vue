<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useActivityStorage } from '../composables/useActivityStorage'

const emit = defineEmits(['selectActivity', 'previewActivity'])

const {
  activities,
  hasActivities,
  createActivity,
  selectActivity,
  deleteActivity,
  duplicateActivity
} = useActivityStorage()

const handleCreateActivity = () => {
  const newActivity = createActivity('新建活动')
  emit('selectActivity', newActivity.id)
}

const handleSelectActivity = (activityId) => {
  selectActivity(activityId)
  emit('selectActivity', activityId)
}

const handleDuplicateActivity = (activityId, e) => {
  e.stopPropagation()
  const newActivity = duplicateActivity(activityId)
  if (newActivity) {
    emit('selectActivity', newActivity.id)
  }
}

const handleDeleteActivity = (activityId, e) => {
  e.stopPropagation()
  if (confirm('确定要删除这个活动吗？此操作不可撤销。')) {
    deleteActivity(activityId)
  }
}

const handlePreviewActivity = (activityId, e) => {
  e.stopPropagation()
  emit('previewActivity', activityId)
}

const formatTime = (time) => {
  if (!time) return '未知'
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

const getActivityStatus = (activity) => {
  const now = dayjs()
  const start = activity.startTime ? dayjs(activity.startTime) : null
  const end = activity.endTime ? dayjs(activity.endTime) : null

  if (!start || !end) {
    return { label: '未设置时间', class: 'status-draft' }
  }

  if (now.isBefore(start)) {
    return { label: '未开始', class: 'status-pending' }
  } else if (now.isAfter(end)) {
    return { label: '已结束', class: 'status-ended' }
  } else {
    return { label: '进行中', class: 'status-active' }
  }
}
</script>

<template>
  <div class="activity-list-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">活动管理</h1>
        <p class="page-subtitle">管理您的所有营销活动</p>
      </div>
      <button class="btn btn-primary btn-lg" @click="handleCreateActivity">
        <span class="icon">+</span>
        <span>新建活动</span>
      </button>
    </header>

    <!-- 活动列表 -->
    <main class="page-content">
      <div class="activity-grid" v-if="hasActivities">
        <div 
          v-for="activity in activities" 
          :key="activity.id"
          class="activity-card"
          @click="handleSelectActivity(activity.id)"
        >
          <div class="card-header">
            <h3 class="activity-name">{{ activity.name || '未命名活动' }}</h3>
            <span 
              class="activity-status"
              :class="getActivityStatus(activity).class"
            >
              {{ getActivityStatus(activity).label }}
            </span>
          </div>

          <div class="card-body">
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-value">{{ activity.banners?.length || 0 }}</span>
                <span class="stat-label">Banner</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-value">{{ activity.products?.length || 0 }}</span>
                <span class="stat-label">商品</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-value total">
                  {{ (activity.banners?.length || 0) + (activity.products?.length || 0) }}
                </span>
                <span class="stat-label">总项目</span>
              </div>
            </div>

            <div class="time-info">
              <div class="time-item">
                <span class="time-label">创建时间</span>
                <span class="time-value">{{ formatTime(activity.createdAt) }}</span>
              </div>
              <div class="time-item">
                <span class="time-label">更新时间</span>
                <span class="time-value">{{ formatTime(activity.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <div class="card-actions">
              <button 
                class="action-btn"
                @click="handlePreviewActivity(activity.id, $event)"
                title="预览活动"
              >
                <span class="action-icon">👁️</span>
                <span class="action-text">预览</span>
              </button>
              <button 
                class="action-btn"
                @click="handleDuplicateActivity(activity.id, $event)"
                title="复制活动"
              >
                <span class="action-icon">📋</span>
                <span class="action-text">复制</span>
              </button>
              <button 
                class="action-btn action-danger"
                @click="handleDeleteActivity(activity.id, $event)"
                title="删除活动"
              >
                <span class="action-icon">🗑️</span>
                <span class="action-text">删除</span>
              </button>
            </div>
            <button class="edit-btn">
              <span>编辑活动</span>
              <span class="arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <div class="empty-icon">📭</div>
        <h2 class="empty-title">暂无活动</h2>
        <p class="empty-text">
          开始创建您的第一个营销活动吧
        </p>
        <button class="btn btn-primary btn-lg" @click="handleCreateActivity">
          <span class="icon">+</span>
          <span>创建第一个活动</span>
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.activity-list-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面头部 */
.page-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-lg {
  padding: 12px 24px;
  font-size: 15px;
}

.btn-primary {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.4);
}

.btn-primary .icon {
  font-size: 18px;
  font-weight: bold;
}

/* 页面内容 */
.page-content {
  padding: 32px;
}

/* 活动网格 */
.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}

/* 活动卡片 */
.activity-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #1890ff;
}

/* 卡片头部 */
.card-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.activity-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.status-draft {
  background: #f5f5f5;
  color: #999;
}

.status-pending {
  background: #e6f7ff;
  color: #1890ff;
}

.status-active {
  background: #f6ffed;
  color: #52c41a;
}

.status-ended {
  background: #fff1f0;
  color: #ff4d4f;
}

/* 卡片内容 */
.card-body {
  padding: 20px;
  flex: 1;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.stat-value.total {
  color: #1890ff;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: #f0f0f0;
}

.time-info {
  background: #fafafa;
  border-radius: 8px;
  padding: 12px 16px;
}

.time-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.time-item + .time-item {
  margin-top: 8px;
}

.time-label {
  color: #999;
}

.time-value {
  color: #666;
  font-weight: 500;
}

/* 卡片底部 */
.card-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
  background: #e6f7ff;
}

.action-btn.action-danger:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
  background: #fff1f0;
}

.action-icon {
  font-size: 14px;
}

.edit-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #1890ff;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}

.edit-btn:hover {
  gap: 8px;
}

.arrow {
  transition: transform 0.2s;
}

.activity-card:hover .arrow {
  transform: translateX(4px);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 72px;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin: 0 0 32px 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    padding: 16px 20px;
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .header-content {
    text-align: center;
  }

  .btn-lg {
    justify-content: center;
  }

  .page-content {
    padding: 20px;
  }

  .activity-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .card-header {
    padding: 16px;
  }

  .card-body {
    padding: 16px;
  }

  .card-footer {
    padding: 12px 16px;
  }
}
</style>
