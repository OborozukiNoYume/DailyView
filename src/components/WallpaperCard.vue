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
      <!-- 始终可见的底部标题栏（触屏设备也能看到） -->
      <div class="card-title-bar">
        <span class="card-title-text">{{ wallpaper.title }}</span>
      </div>
      <!-- 桌面端 hover/focus 覆盖层：完整信息 + 操作按钮 -->
      <div class="card-overlay">
        <div class="card-info">
          <h3 class="card-title">{{ wallpaper.title }}</h3>
          <p class="card-copyright">{{ wallpaper.copyright }}</p>
          <span class="card-date">{{ wallpaper.date }}</span>
        </div>
        <div class="card-actions" @click.stop>
          <el-button
            type="success"
            circle
            :icon="Download"
            aria-label="下载壁纸"
            @click="handleDownload"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getImageUrl, getDownloadUrl } from '../api'

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
  ElMessage.success('开始下载')
}

function onImageError(e) {
  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225"><rect fill="%23e4e7ed" width="400" height="225"/><text fill="%23909399" font-size="14" x="50%" y="50%" text-anchor="middle" dy=".3em">加载失败</text></svg>'
}
</script>

<style scoped>
.wallpaper-card {
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
}

.wallpaper-card:hover,
.wallpaper-card:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.wallpaper-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.4), 0 8px 24px rgba(99, 102, 241, 0.2);
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
  transition: transform 0.3s ease;
}

.wallpaper-card:hover .card-image {
  transform: scale(1.05);
}

/* 始终可见的标题栏 */
.card-title-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.55));
  padding: 24px 12px 10px;
  z-index: 1;
}

.card-title-text {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

/* 桌面端 hover 覆盖层 */
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  padding: 16px;
  opacity: 0;
  transition: opacity 0.25s ease;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  z-index: 2;
}

.wallpaper-card:hover .card-overlay,
.wallpaper-card:focus-within .card-overlay {
  opacity: 1;
}

/* 触屏设备隐藏 hover 覆盖层，使用始终可见的标题栏 */
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
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-copyright {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.card-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-left: 12px;
  flex-shrink: 0;
}

/* 确保触控目标足够大 */
.card-actions :deep(.el-button) {
  min-width: 36px;
  min-height: 36px;
}

/* 尊重用户的减少动效偏好 */
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
