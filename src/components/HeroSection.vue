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
      <div class="hero-badge">今日精选</div>
      <h1 class="hero-title">{{ wallpaper.title }}</h1>
      <p class="hero-copyright">{{ wallpaper.copyright }}</p>
      <div class="hero-meta">
        <span class="hero-date">{{ wallpaper.date }}</span>
        <span v-if="marketDisplay" class="hero-region">{{ marketDisplay }}</span>
      </div>
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
import { formatMarkets } from '../utils/market'

const props = defineProps({
  wallpaper: { type: Object, default: null },
})

defineEmits(['preview'])

const imageUrl = computed(() => {
  if (!props.wallpaper) return ''
  return getImageUrl(props.wallpaper.id, 'preview')
})

const marketDisplay = computed(() => {
  if (!props.wallpaper) return ''
  return formatMarkets(props.wallpaper.mkt)
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
  padding: 0 24px 40px;
}

.hero-badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: var(--radius-full);
  background: var(--glass-bg-strong);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-bright);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 14px;
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

.hero-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.hero-date,
.hero-region {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.70);
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.10);
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
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(transparent, var(--bg-base));
  z-index: 1;
  pointer-events: none;
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
    padding: 0 16px 32px;
  }
}
</style>
