<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import FilterBar from './components/FilterBar.vue'
import WallpaperGrid from './components/WallpaperGrid.vue'
import ImagePreview from './components/ImagePreview.vue'
import AppFooter from './components/AppFooter.vue'
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
const gridRef = ref(null)

onMounted(async () => {
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
</script>

<template>
  <AppHeader @home="goHome" />
  <FilterBar
    :filters="filters"
    :markets="filterOptions.markets"
    :years="filterOptions.years"
    :year-months="filterOptions.yearMonths"
    @change="onFilterChange"
    @reset="onReset"
  />
  <WallpaperGrid ref="gridRef" :filters="filters" @preview="openPreview" />
  <ImagePreview v-model="previewVisible" :wallpaper="previewWallpaper" />
  <AppFooter />
</template>
