<template>
  <header class="app-header" :class="{ 'is-scrolled': scrolled }">
    <div class="header-inner">
      <a href="#" class="logo" aria-label="DailyView 重置筛选" @click.prevent="$emit('home')">
        <IconImage class="logo-icon" />
        <span class="logo-text">DailyView</span>
      </a>
      <span class="header-subtitle">必应每日壁纸</span>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import IconImage from './icons/IconImage.vue'

defineEmits(['home'])

const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 30
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--glass-border);
  transition: all var(--duration-normal) var(--ease-out);
}

.app-header.is-scrolled {
  background: rgba(240, 242, 247, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom-color: var(--glass-border-hover);
}

.header-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text-primary);
  transition: opacity var(--duration-fast);
}

.logo:hover {
  opacity: 0.85;
}

.logo:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
  border-radius: 4px;
}

.logo-icon {
  width: 26px;
  height: 26px;
  color: var(--accent);
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: var(--accent-gradient);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
}

@media (max-width: 768px) {
  .header-subtitle {
    display: none;
  }
}
</style>
