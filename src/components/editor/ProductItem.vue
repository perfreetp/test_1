<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  product: {
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
const localProduct = ref({ ...props.product })

const productStyle = computed(() => ({
  backgroundImage: `url(${localProduct.value.imageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}))

const startEdit = () => {
  localProduct.value = { ...props.product }
  isEditing.value = true
}

const saveEdit = () => {
  emit('update', { ...localProduct.value, id: props.product.id })
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
}

const deleteProduct = () => {
  emit('delete', props.product.id)
}

const moveUp = () => {
  emit('move-up', props.index)
}

const moveDown = () => {
  emit('move-down', props.index)
}
</script>

<template>
  <div class="product-item" :class="{ 'editing': isEditing }">
    <div class="product-preview" v-if="!isEditing">
      <div class="product-image" :style="productStyle">
        <div class="product-overlay">
          <div class="product-index">{{ index + 1 }}</div>
          <div class="product-actions">
            <button class="btn-icon" @click="startEdit" title="编辑">
              ✏️
            </button>
            <button class="btn-icon" @click="moveUp" title="上移" :disabled="index === 0">
              ⬆️
            </button>
            <button class="btn-icon" @click="moveDown" title="下移" :disabled="index === -1">
              ⬇️
            </button>
            <button class="btn-icon delete" @click="deleteProduct" title="删除">
              🗑️
            </button>
          </div>
        </div>
      </div>
      <div class="product-info">
        <div class="product-name">{{ product.name || '未设置商品名' }}</div>
        <div class="product-price">
          <span class="price">¥{{ product.price || '0.00' }}</span>
          <span class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
        </div>
      </div>
    </div>
    
    <div class="product-edit" v-else>
      <div class="form-group">
        <label>商品图片 URL</label>
        <input 
          type="text" 
          v-model="localProduct.imageUrl" 
          placeholder="输入图片 URL"
        />
      </div>
      <div class="form-group">
        <label>商品名称</label>
        <input 
          type="text" 
          v-model="localProduct.name" 
          placeholder="输入商品名称"
        />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>售价</label>
          <input 
            type="number" 
            v-model.number="localProduct.price" 
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div class="form-group">
          <label>原价</label>
          <input 
            type="number" 
            v-model.number="localProduct.originalPrice" 
            placeholder="0.00"
            step="0.01"
          />
        </div>
      </div>
      <div class="form-group">
        <label>商品链接</label>
        <input 
          type="text" 
          v-model="localProduct.linkUrl" 
          placeholder="输入商品链接"
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
.product-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
}

.product-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-preview {
  display: flex;
  flex-direction: column;
}

.product-image {
  height: 160px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.product-image::before {
  content: '商品图片';
  color: #999;
  font-size: 14px;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.product-index {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.product-actions {
  display: flex;
  gap: 6px;
}

.btn-icon {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 12px;
}

.btn-icon:hover {
  background: white;
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon.delete:hover {
  background: #ff4d4f;
  color: white;
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

.price {
  font-size: 16px;
  font-weight: bold;
  color: #ff4d4f;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.product-edit {
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

.form-row {
  display: flex;
  gap: 12px;
}

.form-row .form-group {
  flex: 1;
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
