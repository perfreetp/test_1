<script setup>import { computed } from 'vue';
import dayjs from 'dayjs';
const props = defineProps({
 startTime: {
 type: String,
 default: null
 },
 endTime: {
 type: String,
 default: null
 }
});
const emit = defineEmits(['change']);
const calculatedStatus = computed(() => {
 const now = dayjs();
 const start = props.startTime ? dayjs(props.startTime) : null;
 const end = props.endTime ? dayjs(props.endTime) : null;
 if (!start || !end) {
 return 'draft';
 }
 if (now.isBefore(start)) {
 return 'pending';
 }
 else if (now.isAfter(end)) {
 return 'ended';
 }
 else {
 return 'active';
 }
});
const statusOptions = [
 {
 value: 'draft',
 label: '草稿',
 description: '活动尚未设置完整信息',
 color: '#999',
 bgColor: '#f5f5f5'
 },
 {
 value: 'pending',
 label: '未开始',
 description: '活动时间已设置，但尚未开始',
 color: '#1890ff',
 bgColor: '#e6f7ff'
 },
 {
 value: 'active',
 label: '进行中',
 description: '活动正在进行中',
 color: '#52c41a',
 bgColor: '#f6ffed'
 },
 {
 value: 'ended',
 label: '已结束',
 description: '活动已结束',
 color: '#ff4d4f',
 bgColor: '#fff1f0'
 }
];
const getStatusInfo = (status) => {
 return statusOptions.find(option => option.value === status) || statusOptions[0];
};
const currentStatus = computed(() => getStatusInfo(calculatedStatus.value));
const isAutoCalculated = computed(() => {
 return props.startTime && props.endTime;
});
</script>

<template>
  <div class="status-control">
    <h3 class="section-title">活动状态</h3>
    
    <div class="status-display">
      <div 
        class="status-badge"
        :style="{ backgroundColor: currentStatus.bgColor, color: currentStatus.color }"
      >
        {{ currentStatus.label }}
      </div>
      <p class="status-description">{{ currentStatus.description }}</p>
    </div>
    
    <div class="status-hint" v-if="isAutoCalculated">
      <span class="hint-icon">💡</span>
      <span class="hint-text">状态已根据活动时间自动计算</span>
    </div>
    
    <div class="status-hint warning" v-else>
      <span class="hint-icon">⚠️</span>
      <span class="hint-text">请先设置活动开始时间和结束时间</span>
    </div>
    
    <div class="status-options">
      <div 
        v-for="option in statusOptions" 
        :key="option.value"
        class="status-option"
        :class="{ 'is-active': option.value === calculatedStatus }"
      >
        <div 
          class="option-dot"
          :style="{ backgroundColor: option.color }"
        ></div>
        <div class="option-info">
          <div class="option-label">{{ option.label }}</div>
          <div class="option-desc">{{ option.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-control {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.status-display {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 16px;
}

.status-badge {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.status-description {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.status-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 13px;
  background: #e6f7ff;
}

.status-hint.warning {
  background: #fffbe6;
}

.hint-icon {
  font-size: 16px;
}

.hint-text {
  color: #666;
}

.status-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.status-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
}

.status-option:hover {
  border-color: #1890ff;
}

.status-option.is-active {
  border-color: #1890ff;
  background: #e6f7ff;
}

.option-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

.option-info {
  flex: 1;
}

.option-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.option-desc {
  font-size: 12px;
  color: #999;
}
</style>
