<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import HeroSection from './components/HeroSection.vue'
import FilterBar from './components/FilterBar.vue'
import WallpaperGrid from './components/WallpaperGrid.vue'
import ImagePreview from './components/ImagePreview.vue'
import AppFooter from './components/AppFooter.vue'
import IconTop from './components/icons/IconTop.vue'
import { getFilters } from './api'

const filters = ref({
  mkt: null,
  year: null,
  month: null,
  keyword: '',
})

const filterOptions = ref({
  markets: [],
  years: [],
  yearMonths: {},
})

const previewVisible = ref(false)
const previewWallpaper = ref(null)
const heroWallpaper = ref(null)
const gridRef = ref(null)

const showBackToTop = ref(false)

function handleScroll() {
  showBackToTop.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  try {
    const data = await getFilters()
    filterOptions.value = {
      markets: data.markets || [],
      years: data.years || [],
      yearMonths: data.year_months || {},
    }
  } catch (e) {
    console.error('Failed to load filters:', e)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function onFilterChange(newFilters) {
  filters.value = { ...newFilters }
}

function onReset() {
  filters.value = { mkt: null, year: null, month: null, keyword: '' }
}

function openPreview(wallpaper) {
  previewWallpaper.value = wallpaper
  previewVisible.value = true
}

function goHome() {
  onReset()
}

function onHeroPreview(wallpaper) {
  openPreview(wallpaper)
}

// Receive first wallpaper from grid for hero
function onGridDataLoaded(items) {
  if (items && items.length > 0 && !heroWallpaper.value) {
    heroWallpaper.value = items[0]
  }
}
</script>

<template>
  <a href="#main-content" class="skip-link">跳转到主要内容</a>
  <AppHeader @home="goHome" />
  <HeroSection :wallpaper="heroWallpaper" @preview="onHeroPreview" />
  <FilterBar
    :filters="filters"
    :markets="filterOptions.markets"
    :years="filterOptions.years"
    :year-months="filterOptions.yearMonths"
    @change="onFilterChange"
    @reset="onReset"
  />
  <main id="main-content">
    <WallpaperGrid ref="gridRef" :filters="filters" @preview="openPreview" @data-loaded="onGridDataLoaded" />
  </main>
  <ImagePreview v-model="previewVisible" :wallpaper="previewWallpaper" />
  <AppFooter />
  <transition name="fade">
    <button
      v-show="showBackToTop"
      class="back-to-top"
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      <IconTop />
    </button>
  </transition>
</template>
