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
        <img
          :src="previewUrl"
          :alt="wallpaper.title"
          class="preview-image"
          @click="openFullSize"
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
import { computed } from 'vue'
import { Download } from '@element-plus/icons-vue'
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

const previewUrl = computed(() => {
  if (!props.wallpaper) return ''
  return getImageUrl(props.wallpaper.id, 'preview')
})

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
}
</script>

<style scoped>
.preview-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-image-wrapper {
  width: 100%;
  max-height: 60vh;
  overflow: hidden;
  border-radius: 8px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  cursor: zoom-in;
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
</style>
