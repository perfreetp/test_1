<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  startTime: {
    type: String,
    default: null
  },
  endTime: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:startTime', 'update:endTime'])

const formatDateTime = (value) => {
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DDTHH:mm')
}

const parseDateTime = (value) => {
  if (!value) return null
  return dayjs(value).toISOString()
}

const localStartTime = computed({
  get: () => formatDateTime(props.startTime),
  set: (value) => emit('update:startTime', parseDateTime(value))
})

const localEndTime = computed({
  get: () => formatDateTime(props.endTime),
  set: (value) => emit('update:endTime', parseDateTime(value))
})

const minEndTime = computed(() => {
  return localStartTime.value || ''
})

const statusText = computed(() => {
  const now = dayjs()
  const start = props.startTime ? dayjs(props.startTime) : null
  const end = props.endTime ? dayjs(props.endTime) : null

  if (!start || !end) {
    return '未设置时间'
  }

  if (now.isBefore(start)) {
    return '未开始'
  } else if (now.isAfter(end)) {
    return '已结束'
  } else {
    return '进行中'
  }
})

const statusClass = computed(() => {
  const now = dayjs()
  const start = props.startTime ? dayjs(props.startTime) : null
  const end = props.endTime ? dayjs(props.endTime) : null

  if (!start || !end) {
    return 'status-default'
  }

  if (now.isBefore(start)) {
    return 'status-pending'
  } else if (now.isAfter(end)) {
    return 'status-ended'
  } else {
    return 'status-active'
  }
})
</script>

<template>
  <div class="time-config">
    <h3 class="section-title">活动时间</h3>
    
    <div class="time-inputs">
      <div class="time-group">
        <label>开始时间</label>
        <input 
          type="datetime-local" 
          v-model="localStartTime"
        />
      </div>
      
      <div class="time-divider">至</div>
      
      <div class="time-group">
        <label>结束时间</label>
        <input 
          type="datetime-local" 
          v-model="localEndTime"
          :min="minEndTime"
        />
      </div>
    </div>
    
    <div class="time-status" v-if="startTime && endTime">
      <span class="status-label">当前状态：</span>
      <span class="status-value" :class="statusClass">{{ statusText }}</span>
    </div>
    
    <div class="time-hint" v-else>
      提示：设置开始时间和结束时间后，系统会自动判断活动状态
    </div>
  </div>
</template>

<style scoped>
.time-config {
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

.time-inputs {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.time-group {
  flex: 1;
  min-width: 200px;
}

.time-group label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.time-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.time-group input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.time-divider {
  color: #999;
  font-size: 14px;
  padding-bottom: 10px;
}

.time-status {
  display: flex;
  align-items: center;
  margin-top: 16px;
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
}

.status-label {
  font-size: 13px;
  color: #666;
}

.status-value {
  font-size: 14px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 4px;
  margin-left: 8px;
}

.status-default {
  background: #f0f0f0;
  color: #666;
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

.time-hint {
  margin-top: 16px;
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
  font-size: 13px;
  color: #999;
}
</style>
