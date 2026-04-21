<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="visible && wallpaper" class="modal-backdrop" @click.self="close">
        <div class="modal-panel">
          <button class="modal-close" aria-label="关闭" @click="close">
            <IconClose class="close-icon" />
          </button>

          <div class="modal-content">
            <div class="preview-image-wrapper">
              <div v-if="imageLoading" class="preview-loading">
                <IconLoading class="preview-loading-icon" />
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
              <div class="preview-info-grid">
                <div class="info-item">
                  <span class="info-label">日期</span>
                  <span class="info-value">{{ wallpaper.date }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">版权</span>
                  <span class="info-value">{{ wallpaper.copyright }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">分辨率</span>
                  <span class="info-value">{{ wallpaper.width }} x {{ wallpaper.height }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">地区</span>
                  <span class="info-value">{{ wallpaper.mkt }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">大小</span>
                  <span class="info-value">{{ formatSize(wallpaper.bytes) }}</span>
                </div>
              </div>
              <button class="btn btn-primary download-btn" @click="handleDownload">
                <IconDownload class="btn-icon-svg" />
                下载原图 ({{ wallpaper.width }}x{{ wallpaper.height }})
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import IconClose from './icons/IconClose.vue'
import IconDownload from './icons/IconDownload.vue'
import IconLoading from './icons/IconLoading.vue'
import { getImageUrl, getDownloadUrl } from '../api'
import { showToast } from '../utils/toast'

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
  showToast('开始下载')
}

function close() {
  visible.value = false
}

function onKeydown(e) {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

// Lock body scroll when open
watch(() => props.modelValue, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.70);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-panel {
  position: relative;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  background: var(--glass-bg-strong);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-hover);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-elevated);
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  transition: all var(--duration-fast);
  z-index: 2;
}

.modal-close:hover {
  background: var(--glass-bg-hover);
  color: var(--text-primary);
}

.close-icon {
  width: 18px;
  height: 18px;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px;
}

/* Image */
.preview-image-wrapper {
  position: relative;
  width: 100%;
  max-height: 55vh;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 14px;
}

.preview-loading-icon {
  width: 28px;
  height: 28px;
  color: var(--accent);
}

.preview-image {
  max-width: 100%;
  max-height: 55vh;
  object-fit: contain;
  cursor: zoom-in;
  transition: opacity var(--duration-normal) ease;
}

.preview-image.is-hidden {
  opacity: 0;
}

/* Details */
.preview-details {
  flex-shrink: 0;
}

.preview-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.preview-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.info-item {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
}

.info-label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.info-value {
  font-size: 13px;
  color: var(--text-primary);
  word-break: break-word;
}

.btn-icon-svg {
  width: 16px;
  height: 16px;
}

.download-btn {
  width: 100%;
}

/* Desktop layout */
@media (min-width: 1024px) {
  .modal-content {
    flex-direction: row;
  }

  .preview-image-wrapper {
    flex: 1;
    max-height: 70vh;
  }

  .preview-image {
    max-height: 70vh;
  }

  .preview-details {
    width: 280px;
    flex-shrink: 0;
  }

  .preview-info-grid {
    grid-template-columns: 1fr;
  }
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform 0.3s var(--ease-out);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  transform: scale(0.95) translateY(10px);
}
</style>
