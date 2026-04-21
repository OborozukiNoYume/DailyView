<template>
  <div
    class="wallpaper-card"
    tabindex="0"
    role="button"
    :aria-label="'预览壁纸: ' + wallpaper.title"
    @click="$emit('preview', wallpaper)"
    @keydown.enter="$emit('preview', wallpaper)"
  >
    <div class="card-image-wrapper">
      <img
        :src="imageUrl"
        :alt="wallpaper.title"
        loading="lazy"
        class="card-image"
        @error="onImageError"
      />
      <!-- Always-visible title bar -->
      <div class="card-title-bar">
        <span class="card-title-text">{{ wallpaper.title }}</span>
      </div>
      <!-- Desktop hover overlay -->
      <div class="card-overlay">
        <div class="card-info">
          <h3 class="card-title">{{ wallpaper.title }}</h3>
          <p class="card-copyright">{{ wallpaper.copyright }}</p>
          <span class="card-date">{{ wallpaper.date }}</span>
        </div>
        <div class="card-actions" @click.stop>
          <button class="btn btn-icon btn-ghost download-btn" aria-label="下载壁纸" @click="handleDownload">
            <IconDownload class="action-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import IconDownload from './icons/IconDownload.vue'
import { getImageUrl, getDownloadUrl } from '../api'
import { showToast } from '../utils/toast'

const props = defineProps({
  wallpaper: { type: Object, required: true },
})

defineEmits(['preview'])

const imageUrl = computed(() => getImageUrl(props.wallpaper.id, 'thumbnail'))

function handleDownload() {
  const link = document.createElement('a')
  link.href = getDownloadUrl(props.wallpaper.id)
  link.download = `${props.wallpaper.date}_${props.wallpaper.title}.jpg`
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('开始下载')
}

function onImageError(e) {
  e.target.src = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225"><rect fill="#e2e8f0" width="400" height="225"/><text fill="#94a3b8" font-size="14" x="50%" y="50%" text-anchor="middle" dy=".3em">加载失败</text></svg>'
  )
}
</script>

<style scoped>
.wallpaper-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}

.wallpaper-card:hover,
.wallpaper-card:focus-visible {
  transform: translateY(-4px);
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
  box-shadow:
    var(--shadow-card),
    0 0 30px rgba(99, 102, 241, 0.08);
}

.wallpaper-card:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px var(--accent-glow),
    var(--shadow-card);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  overflow: hidden;
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s var(--ease-out);
}

.wallpaper-card:hover .card-image {
  transform: scale(1.06);
}

/* Always-visible title bar */
.card-title-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
  padding: 28px 12px 10px;
  z-index: 1;
}

.card-title-text {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

/* Desktop hover overlay */
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 16px;
  opacity: 0;
  transition: opacity var(--duration-normal) ease;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  z-index: 2;
}

.wallpaper-card:hover .card-overlay,
.wallpaper-card:focus-within .card-overlay {
  opacity: 1;
}

@media (hover: none) {
  .card-overlay {
    display: none;
  }
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-copyright {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.card-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-left: 12px;
  flex-shrink: 0;
}

.download-btn {
  min-width: 36px;
  min-height: 36px;
}

.action-icon {
  width: 18px;
  height: 18px;
}

@media (prefers-reduced-motion: reduce) {
  .wallpaper-card {
    transition: none;
  }
  .wallpaper-card:hover,
  .wallpaper-card:focus-visible {
    transform: none;
  }
  .card-image {
    transition: none;
  }
  .wallpaper-card:hover .card-image {
    transform: none;
  }
  .card-overlay {
    transition: none;
  }
}
</style>
