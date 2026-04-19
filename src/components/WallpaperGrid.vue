<template>
  <div class="wallpaper-grid">
    <div v-if="loading" class="grid-loading">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <div v-else-if="wallpapers.length === 0" class="grid-empty">
      <el-empty description="暂无壁纸数据" />
    </div>

    <div v-else class="grid-container">
      <WallpaperCard
        v-for="wp in wallpapers"
        :key="wp.id"
        :wallpaper="wp"
        @preview="(wp) => $emit('preview', wp)"
      />
    </div>

    <div v-if="wallpapers.length > 0" class="grid-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[12, 20, 30, 48]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="onPageChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { getWallpapers } from '../api'
import WallpaperCard from './WallpaperCard.vue'

const props = defineProps({
  filters: { type: Object, required: true },
})

const emit = defineEmits(['preview'])

const wallpapers = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

async function fetchWallpapers() {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
    }
    if (props.filters.mkt) {
      params.mkt = props.filters.mkt
    } else {
      params.dedup = true
    }
    if (props.filters.year) params.year = props.filters.year
    if (props.filters.month) params.month = props.filters.month
    if (props.filters.keyword) params.keyword = props.filters.keyword

    const data = await getWallpapers(params)
    wallpapers.value = data.items
    total.value = data.total
  } catch (e) {
    console.error('Failed to fetch wallpapers:', e)
    wallpapers.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function onPageChange() {
  fetchWallpapers()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(
  () => ({ ...props.filters }),
  () => {
    currentPage.value = 1
    fetchWallpapers()
  },
  { deep: true },
)

fetchWallpapers()

defineExpose({ refresh: fetchWallpapers })
</script>

<style scoped>
.wallpaper-grid {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.grid-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 0;
  color: #909399;
  font-size: 14px;
}

.grid-empty {
  padding: 80px 0;
}

.grid-pagination {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .wallpaper-grid {
    padding: 16px;
  }

  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
}
</style>
