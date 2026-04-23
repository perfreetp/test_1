<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import Sortable from 'sortablejs'
import { useActivityStorage } from '../../composables/useActivityStorage'
import BannerItem from './BannerItem.vue'
import ProductItem from './ProductItem.vue'
import TimeConfig from './TimeConfig.vue'
import StatusControl from './StatusControl.vue'
import ActivityPreview from '../preview/ActivityPreview.vue'

const { activity, resetActivity } = useActivityStorage()

const isPreviewMode = ref(false)
const bannerListRef = ref(null)
const productListRef = ref(null)

const bannerSortable = ref(null)
const productSortable = ref(null)

const togglePreviewMode = () => {
  isPreviewMode.value = !isPreviewMode.value
}

const addBanner = () => {
  const newBanner = {
    id: Date.now().toString(),
    title: '',
    imageUrl: '',
    linkUrl: ''
  }
  activity.value.banners.push(newBanner)
}

const updateBanner = (updatedBanner) => {
  const index = activity.value.banners.findIndex(b => b.id === updatedBanner.id)
  if (index !== -1) {
    activity.value.banners[index] = { ...updatedBanner }
  }
}

const deleteBanner = (bannerId) => {
  activity.value.banners = activity.value.banners.filter(b => b.id !== bannerId)
}

const moveBannerUp = (index) => {
  if (index > 0) {
    const temp = activity.value.banners[index]
    activity.value.banners[index] = activity.value.banners[index - 1]
    activity.value.banners[index - 1] = temp
  }
}

const moveBannerDown = (index) => {
  if (index < activity.value.banners.length - 1) {
    const temp = activity.value.banners[index]
    activity.value.banners[index] = activity.value.banners[index + 1]
    activity.value.banners[index + 1] = temp
  }
}

const addProduct = () => {
  const newProduct = {
    id: Date.now().toString(),
    name: '',
    imageUrl: '',
    price: 0,
    originalPrice: 0,
    linkUrl: ''
  }
  activity.value.products.push(newProduct)
}

const updateProduct = (updatedProduct) => {
  const index = activity.value.products.findIndex(p => p.id === updatedProduct.id)
  if (index !== -1) {
    activity.value.products[index] = { ...updatedProduct }
  }
}

const deleteProduct = (productId) => {
  activity.value.products = activity.value.products.filter(p => p.id !== productId)
}

const moveProductUp = (index) => {
  if (index > 0) {
    const temp = activity.value.products[index]
    activity.value.products[index] = activity.value.products[index - 1]
    activity.value.products[index - 1] = temp
  }
}

const moveProductDown = (index) => {
  if (index < activity.value.products.length - 1) {
    const temp = activity.value.products[index]
    activity.value.products[index] = activity.value.products[index + 1]
    activity.value.products[index + 1] = temp
  }
}

const initSortable = async () => {
  await nextTick()
  
  if (bannerListRef.value && !bannerSortable.value) {
    bannerSortable.value = new Sortable(bannerListRef.value, {
      animation: 150,
      handle: '.banner-item',
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt
        if (oldIndex !== newIndex) {
          const item = activity.value.banners.splice(oldIndex, 1)[0]
          activity.value.banners.splice(newIndex, 0, item)
        }
      }
    })
  }
  
  if (productListRef.value && !productSortable.value) {
    productSortable.value = new Sortable(productListRef.value, {
      animation: 150,
      handle: '.product-item',
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt
        if (oldIndex !== newIndex) {
          const item = activity.value.products.splice(oldIndex, 1)[0]
          activity.value.products.splice(newIndex, 0, item)
        }
      }
    })
  }
}

onMounted(() => {
  initSortable()
})

const totalItems = computed(() => {
  return activity.value.banners.length + activity.value.products.length
})
</script>

<template>
  <div class="activity-editor" :class="{ 'preview-mode': isPreviewMode }">
    <!-- 编辑器头部 -->
    <header class="editor-header">
      <div class="header-left">
        <h1 class="editor-title">活动编辑器</h1>
        <input 
          type="text" 
          v-model="activity.name"
          class="activity-name-input"
          placeholder="输入活动名称"
          v-if="!isPreviewMode"
        />
      </div>
      
      <div class="header-right">
        <button 
          class="btn btn-outline"
          @click="resetActivity"
          v-if="!isPreviewMode"
        >
          重置
        </button>
        <button 
          class="btn btn-preview"
          @click="togglePreviewMode"
        >
          {{ isPreviewMode ? '返回编辑' : '预览' }}
        </button>
      </div>
    </header>

    <!-- 预览模式 -->
    <div class="preview-container" v-if="isPreviewMode">
      <ActivityPreview :activity="activity" />
    </div>

    <!-- 编辑模式 -->
    <div class="edit-container" v-else>
      <div class="main-content">
        <!-- 左侧：内容编辑区 -->
        <div class="content-section">
          <!-- Banner 区域 -->
          <section class="section-panel">
            <div class="section-header">
              <h2 class="section-title">
                <span class="icon">🖼️</span>
                Banner 列表
                <span class="count">({{ activity.banners.length }})</span>
              </h2>
              <button class="btn btn-primary btn-sm" @click="addBanner">
                + 添加 Banner
              </button>
            </div>
            
            <div class="banner-list" ref="bannerListRef">
              <BannerItem
                v-for="(banner, index) in activity.banners"
                :key="banner.id"
                :banner="banner"
                :index="index"
                @update="updateBanner"
                @delete="deleteBanner"
                @move-up="moveBannerUp"
                @move-down="moveBannerDown"
              />
              
              <div class="empty-hint" v-if="activity.banners.length === 0">
                <div class="empty-icon">📭</div>
                <p>暂无 Banner，点击上方按钮添加</p>
                <p class="hint">提示：可以拖拽排序调整顺序</p>
              </div>
            </div>
          </section>

          <!-- 商品位区域 -->
          <section class="section-panel">
            <div class="section-header">
              <h2 class="section-title">
                <span class="icon">🛍️</span>
                商品列表
                <span class="count">({{ activity.products.length }})</span>
              </h2>
              <button class="btn btn-primary btn-sm" @click="addProduct">
                + 添加商品
              </button>
            </div>
            
            <div class="product-grid" ref="productListRef">
              <ProductItem
                v-for="(product, index) in activity.products"
                :key="product.id"
                :product="product"
                :index="index"
                @update="updateProduct"
                @delete="deleteProduct"
                @move-up="moveProductUp"
                @move-down="moveProductDown"
              />
              
              <div class="empty-hint grid-empty" v-if="activity.products.length === 0">
                <div class="empty-icon">📦</div>
                <p>暂无商品，点击上方按钮添加</p>
                <p class="hint">提示：可以拖拽排序调整顺序</p>
              </div>
            </div>
          </section>
        </div>

        <!-- 右侧：配置区 -->
        <div class="config-section">
          <TimeConfig
            :startTime="activity.startTime"
            :endTime="activity.endTime"
            @update:startTime="activity.startTime = $event"
            @update:endTime="activity.endTime = $event"
          />
          
          <StatusControl
            :startTime="activity.startTime"
            :endTime="activity.endTime"
          />
          
          <!-- 统计信息 -->
          <div class="stats-panel">
            <h3 class="section-title">统计信息</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ activity.banners.length }}</div>
                <div class="stat-label">Banner 数量</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ activity.products.length }}</div>
                <div class="stat-label">商品数量</div>
              </div>
              <div class="stat-item total">
                <div class="stat-value">{{ totalItems }}</div>
                <div class="stat-label">总项目数</div>
              </div>
            </div>
          </div>
          
          <!-- 本地缓存提示 -->
          <div class="storage-hint">
            <div class="hint-icon">💾</div>
            <div class="hint-content">
              <div class="hint-title">自动保存</div>
              <div class="hint-text">所有更改已自动保存到本地缓存</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-editor {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 头部样式 */
.editor-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.editor-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.activity-name-input {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  min-width: 240px;
}

.activity-name-input:focus {
  outline: none;
  border-color: #1890ff;
}

.header-right {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-sm {
  padding: 6px 14px;
  font-size: 13px;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-outline {
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
}

.btn-outline:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-preview {
  background: #52c41a;
  color: white;
}

.btn-preview:hover {
  background: #73d13d;
}

/* 主内容区 */
.main-content {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  padding: 24px;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.config-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-panel {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title .icon {
  font-size: 18px;
}

.section-title .count {
  font-size: 13px;
  color: #999;
  font-weight: normal;
}

/* Banner 列表 */
.banner-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 商品网格 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

/* 空状态提示 */
.empty-hint {
  padding: 40px 20px;
  text-align: center;
  background: #fafafa;
  border-radius: 8px;
  border: 2px dashed #e0e0e0;
}

.empty-hint.grid-empty {
  grid-column: 1 / -1;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-hint p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.empty-hint .hint {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}

/* 统计面板 */
.stats-panel {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.stat-item {
  text-align: center;
  padding: 12px 8px;
  background: #fafafa;
  border-radius: 4px;
}

.stat-item.total {
  background: #e6f7ff;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-item.total .stat-value {
  color: #1890ff;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

/* 本地缓存提示 */
.storage-hint {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f6ffed;
  border-radius: 8px;
  border: 1px solid #b7eb8f;
}

.storage-hint .hint-icon {
  font-size: 24px;
}

.hint-content .hint-title {
  font-size: 14px;
  font-weight: 500;
  color: #52c41a;
  margin-bottom: 4px;
}

.hint-content .hint-text {
  font-size: 12px;
  color: #73d13d;
}

/* 预览模式 */
.preview-container {
  padding: 24px;
}

/* 拖拽排序样式 */
.sortable-ghost {
  opacity: 0.5;
  background: #e6f7ff;
}

.sortable-drag {
  opacity: 0.8;
}

/* 响应式 */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .config-section {
    order: -1;
  }
  
  .header-left {
    flex-wrap: wrap;
  }
}

@media (max-width: 640px) {
  .editor-header {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
