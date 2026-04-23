<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import { formatUrl, isValidUrl } from '../../utils/validators'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
})

const activityStatus = computed(() => {
  const now = dayjs()
  const start = props.activity.startTime ? dayjs(props.activity.startTime) : null
  const end = props.activity.endTime ? dayjs(props.activity.endTime) : null

  if (!start || !end) {
    return { label: '未设置时间', class: 'status-draft' }
  }

  if (now.isBefore(start)) {
    return { label: '活动未开始', class: 'status-pending' }
  } else if (now.isAfter(end)) {
    return { label: '活动已结束', class: 'status-ended' }
  } else {
    return { label: '活动进行中', class: 'status-active' }
  }
})

const formattedTime = computed(() => {
  if (!props.activity.startTime || !props.activity.endTime) {
    return '活动时间：暂未设置'
  }
  
  const start = dayjs(props.activity.startTime).format('YYYY年MM月DD日 HH:mm')
  const end = dayjs(props.activity.endTime).format('YYYY年MM月DD日 HH:mm')
  return `活动时间：${start} 至 ${end}`
})

const hasBanners = computed(() => {
  return props.activity.banners && props.activity.banners.length > 0
})

const hasProducts = computed(() => {
  return props.activity.products && props.activity.products.length > 0
})

const bannerStyle = (banner) => ({
  backgroundImage: banner.imageUrl ? `url(${banner.imageUrl})` : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})

const productStyle = (product) => ({
  backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})

const handleBannerClick = (banner) => {
  if (banner.linkUrl && isValidUrl(banner.linkUrl)) {
    const url = formatUrl(banner.linkUrl)
    window.open(url, '_blank')
  }
}

const handleProductClick = (product) => {
  if (product.linkUrl && isValidUrl(product.linkUrl)) {
    const url = formatUrl(product.linkUrl)
    window.open(url, '_blank')
  }
}

const hasBannerLink = (banner) => {
  return banner.linkUrl && isValidUrl(banner.linkUrl)
}

const hasProductLink = (product) => {
  return product.linkUrl && isValidUrl(product.linkUrl)
}
</script>

<template>
  <div class="activity-preview">
    <div class="preview-header">
      <h2 class="activity-name">{{ activity.name || '活动名称' }}</h2>
      <div class="activity-status" :class="activityStatus.class">
        {{ activityStatus.label }}
      </div>
    </div>
    
    <div class="activity-time">
      {{ formattedTime }}
    </div>
    
    <div class="preview-section" v-if="hasBanners">
      <h3 class="section-title">活动 Banner</h3>
      <div class="banner-list">
        <div 
          v-for="banner in activity.banners" 
          :key="banner.id"
          class="banner-card"
          :class="{ 'clickable': hasBannerLink(banner) }"
          :style="bannerStyle(banner)"
          @click="handleBannerClick(banner)"
        >
          <div class="banner-content">
            <div class="banner-title">{{ banner.title || 'Banner 标题' }}</div>
            <div class="link-hint" v-if="hasBannerLink(banner)">
              🔗 点击跳转
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="empty-section" v-else>
      <div class="empty-icon">🖼️</div>
      <div class="empty-text">暂无 Banner</div>
    </div>
    
    <div class="preview-section" v-if="hasProducts">
      <h3 class="section-title">精选商品</h3>
      <div class="product-grid">
        <div 
          v-for="product in activity.products" 
          :key="product.id"
          class="product-card"
          :class="{ 'clickable': hasProductLink(product) }"
          @click="handleProductClick(product)"
        >
          <div class="product-image" :style="productStyle(product)">
            <div class="image-placeholder" v-if="!product.imageUrl">
              商品图片
            </div>
            <div class="link-badge" v-if="hasProductLink(product)">
              🔗
            </div>
          </div>
          <div class="product-info">
            <div class="product-name">{{ product.name || '商品名称' }}</div>
            <div class="product-price">
              <span class="current-price">¥{{ product.price || '0.00' }}</span>
              <span class="original-price" v-if="product.originalPrice">
                ¥{{ product.originalPrice }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="empty-section" v-else>
      <div class="empty-icon">🛍️</div>
      <div class="empty-text">暂无商品</div>
    </div>
  </div>
</template>

<style scoped>
.activity-preview {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  min-height: 100vh;
}

.preview-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.activity-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.activity-status {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
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

.activity-time {
  padding: 16px 20px;
  font-size: 14px;
  color: #666;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.preview-section {
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.banner-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.banner-card {
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  position: relative;
  transition: all 0.3s;
}

.banner-card.clickable {
  cursor: pointer;
}

.banner-card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.banner-card::before {
  content: 'Banner 图片';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 14px;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  color: white;
}

.banner-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
}

.link-hint {
  font-size: 12px;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.product-card.clickable {
  cursor: pointer;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.product-image {
  height: 200px;
  background: #f5f5f5;
  position: relative;
}

.image-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 14px;
}

.link-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff4d4f;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.empty-section {
  padding: 60px 20px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: #999;
}
</style>
