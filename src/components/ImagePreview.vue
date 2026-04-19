<template>
  <el-dialog
    v-model="visible"
    :title="wallpaper?.title"
    width="90%"
    top="5vh"
    destroy-on-close
    class="preview-dialog"
  >
    <div v-if="wallpaper" class="preview-content">
      <div class="preview-image-wrapper">
        <div v-if="imageLoading" class="preview-image-loading">
          <el-icon class="is-loading" :size="32"><Loading /></el-icon>
          <span>加载中...</span>
        </div>
        <img
          :src="previewUrl"
          :alt="wallpaper.title"
          class="preview-image"
          :class="{ 'is-hidden': imageLoading }"
          @click="openFullSize"
          @load="onImageLoad"
          @error="onImageError"
        />
      </div>
      <div class="preview-details">
        <h3 class="preview-title">{{ wallpaper.title }}</h3>
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="日期">{{ wallpaper.date }}</el-descriptions-item>
          <el-descriptions-item label="版权">{{ wallpaper.copyright }}</el-descriptions-item>
          <el-descriptions-item label="分辨率">{{ wallpaper.width }} x {{ wallpaper.height }}</el-descriptions-item>
          <el-descriptions-item label="地区">{{ wallpaper.mkt }}</el-descriptions-item>
          <el-descriptions-item label="大小">{{ formatSize(wallpaper.bytes) }}</el-descriptions-item>
        </el-descriptions>
        <div class="preview-actions">
          <el-button type="primary" :icon="Download" @click="handleDownload">
            下载原图 ({{ wallpaper.width }}x{{ wallpaper.height }})
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Download, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getImageUrl, getDownloadUrl } from '../api'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  wallpaper: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const imageLoading = ref(true)

// 切换壁纸时重置加载状态
watch(() => props.wallpaper, () => {
  imageLoading.value = true
})

const previewUrl = computed(() => {
  if (!props.wallpaper) return ''
  return getImageUrl(props.wallpaper.id, 'preview')
})

function onImageLoad() {
  imageLoading.value = false
}

function onImageError() {
  imageLoading.value = false
}

function formatSize(bytes) {
  if (!bytes) return '-'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function openFullSize() {
  if (props.wallpaper) {
    window.open(previewUrl.value, '_blank')
  }
}

function handleDownload() {
  if (!props.wallpaper) return
  const link = document.createElement('a')
  link.href = getDownloadUrl(props.wallpaper.id)
  link.download = `${props.wallpaper.date}_${props.wallpaper.title}.jpg`
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  ElMessage.success('开始下载')
}
</script>

<style scoped>
.preview-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-image-wrapper {
  position: relative;
  width: 100%;
  max-height: 60vh;
  overflow: hidden;
  border-radius: 8px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #909399;
  font-size: 14px;
}

.preview-image {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  cursor: zoom-in;
  transition: opacity 0.3s ease;
}

.preview-image.is-hidden {
  opacity: 0;
}

.preview-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #303133;
}

.preview-actions {
  margin-top: 16px;
}

@media (min-width: 1024px) {
  .preview-content {
    flex-direction: row;
  }

  .preview-image-wrapper {
    flex: 1;
    max-height: 75vh;
  }

  .preview-image {
    max-height: 75vh;
  }

  .preview-details {
    width: 300px;
    flex-shrink: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .preview-image {
    transition: none;
  }
}
</style>
