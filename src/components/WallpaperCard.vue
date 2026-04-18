<template>
  <div class="wallpaper-card" @click="$emit('preview', wallpaper)">
    <div class="card-image-wrapper">
      <img
        :src="imageUrl"
        :alt="wallpaper.title"
        loading="lazy"
        class="card-image"
        @error="onImageError"
      />
      <div class="card-overlay">
        <div class="card-info">
          <h3 class="card-title">{{ wallpaper.title }}</h3>
          <p class="card-copyright">{{ wallpaper.copyright }}</p>
          <span class="card-date">{{ wallpaper.date }}</span>
        </div>
        <div class="card-actions" @click.stop>
          <el-button
            type="primary"
            circle
            :icon="ZoomIn"
            size="small"
            @click="$emit('preview', wallpaper)"
          />
          <el-button
            type="success"
            circle
            :icon="Download"
            size="small"
            @click="handleDownload"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ZoomIn, Download } from '@element-plus/icons-vue'
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

.wallpaper-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
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

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
  padding: 40px 16px 16px;
  opacity: 0;
  transition: opacity 0.25s ease;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.wallpaper-card:hover .card-overlay {
  opacity: 1;
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
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.card-date {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-left: 12px;
  flex-shrink: 0;
}
</style>
