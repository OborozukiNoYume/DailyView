<template>
  <div class="wallpaper-grid">
    <div v-if="loading" class="grid-loading">
      <IconLoading class="loading-icon" />
      <span class="loading-text">加载中...</span>
    </div>

    <div v-else-if="wallpapers.length === 0" class="grid-empty">
      <div class="empty-icon">
        <IconImage />
      </div>
      <p class="empty-text">暂无壁纸数据</p>
      <p class="empty-hint">尝试调整筛选条件</p>
    </div>

    <template v-else>
      <div class="grid-container">
        <WallpaperCard
          v-for="wp in wallpapers"
          :key="wp.id"
          :wallpaper="wp"
          @preview="(wp) => $emit('preview', wp)"
        />
      </div>

      <div v-if="total > pageSize" class="grid-pagination">
        <div class="pagination glass">
          <button
            class="page-btn"
            :disabled="currentPage <= 1"
            aria-label="上一页"
            @click="goPage(currentPage - 1)"
          >
            <IconChevronLeft class="page-icon" />
          </button>

          <template v-for="p in visiblePages" :key="p">
            <span v-if="p === '...'" class="page-ellipsis">...</span>
            <button
              v-else
              class="page-btn"
              :class="{ 'is-active': p === currentPage }"
              @click="goPage(p)"
            >
              {{ p }}
            </button>
          </template>

          <button
            class="page-btn"
            :disabled="currentPage >= totalPages"
            aria-label="下一页"
            @click="goPage(currentPage + 1)"
          >
            <IconChevronRight class="page-icon" />
          </button>
        </div>

        <div class="pagination-info">
          共 {{ total }} 张壁纸
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import IconLoading from './icons/IconLoading.vue'
import IconImage from './icons/IconImage.vue'
import IconChevronLeft from './icons/IconChevronLeft.vue'
import IconChevronRight from './icons/IconChevronRight.vue'
import { getWallpapers } from '../api'
import WallpaperCard from './WallpaperCard.vue'

const props = defineProps({
  filters: { type: Object, required: true },
})

const emit = defineEmits(['preview', 'dataLoaded'])

const wallpapers = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const visiblePages = computed(() => {
  const tp = totalPages.value
  const cp = currentPage.value
  if (tp <= 7) {
    return Array.from({ length: tp }, (_, i) => i + 1)
  }
  const pages = []
  pages.push(1)
  if (cp > 3) pages.push('...')
  const start = Math.max(2, cp - 1)
  const end = Math.min(tp - 1, cp + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (cp < tp - 2) pages.push('...')
  pages.push(tp)
  return pages
})

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
    if (data.items && data.items.length > 0) {
      emit('dataLoaded', data.items[0])
    }
  } catch (e) {
    console.error('Failed to fetch wallpapers:', e)
    wallpapers.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function goPage(p) {
  if (p < 1 || p > totalPages.value) return
  currentPage.value = p
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
  max-width: var(--max-width);
  width: 100%;
  margin: 0 auto;
  padding: 24px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* Loading */
.grid-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 80px 0;
}

.loading-icon {
  width: 32px;
  height: 32px;
  color: var(--accent);
}

.loading-text {
  font-size: 14px;
  color: var(--text-secondary);
}

/* Empty */
.grid-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 8px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-muted);
  margin-bottom: 8px;
}

.empty-icon svg {
  width: 28px;
  height: 28px;
}

.empty-text {
  font-size: 16px;
  color: var(--text-secondary);
}

.empty-hint {
  font-size: 13px;
  color: var(--text-muted);
}

/* Pagination */
.grid-pagination {
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
}

.page-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--duration-fast) var(--ease-out);
}

.page-btn:hover:not(:disabled):not(.is-active) {
  background: var(--glass-bg-hover);
  color: var(--text-primary);
}

.page-btn.is-active {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 2px 8px var(--accent-glow);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-icon {
  width: 16px;
  height: 16px;
}

.page-ellipsis {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 14px;
}

.pagination-info {
  font-size: 13px;
  color: var(--text-muted);
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
