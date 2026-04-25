<template>
  <section v-if="wallpaper" class="hero">
    <div class="hero-bg">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="wallpaper.title"
        class="hero-bg-img"
        @error="onBgError"
      />
      <div class="hero-bg-overlay"></div>
    </div>
    <div class="hero-content">
      <h1 class="hero-title">{{ wallpaper.title }}</h1>
      <p class="hero-copyright">{{ wallpaper.copyright }}</p>
      <div class="hero-actions">
        <button class="btn btn-primary" @click="$emit('preview', wallpaper)">
          <IconImage class="btn-icon-svg" />
          查看大图
        </button>
        <button class="btn btn-ghost" @click="handleDownload">
          <IconDownload class="btn-icon-svg" />
          下载原图
        </button>
      </div>
    </div>
    <div class="hero-bottom-fade"></div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import IconImage from './icons/IconImage.vue'
import IconDownload from './icons/IconDownload.vue'
import { getImageUrl, getDownloadUrl } from '../api'
import { showToast } from '../utils/toast'

const props = defineProps({
  wallpaper: { type: Object, default: null },
})

defineEmits(['preview'])

const imageUrl = computed(() => {
  if (!props.wallpaper) return ''
  return getImageUrl(props.wallpaper.id, 'preview')
})


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

function onBgError(e) {
  e.target.style.display = 'none'
}
</script>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  min-height: 420px;
  max-height: 520px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.02);
}

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.85) 100%),
    linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: var(--max-width);
  width: 100%;
  margin: 0 auto;
  padding: 0 24px 24px;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin-bottom: 8px;
  max-width: 600px;
}

.hero-copyright {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
  max-width: 500px;
  margin-bottom: 10px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-icon-svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.hero-bottom-fade {
  display: none;
}

@media (max-width: 768px) {
  .hero {
    min-height: 320px;
    max-height: 400px;
  }

  .hero-title {
    font-size: 24px;
  }

  .hero-content {
    padding: 0 16px 18px;
  }
}
</style>
