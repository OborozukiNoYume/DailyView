<template>
  <div class="filter-bar">
    <div class="filter-inner">
      <!-- 移动端筛选开关按钮 -->
      <div class="filter-toggle-row">
        <el-button
          size="small"
          class="filter-toggle-btn"
          @click="filterExpanded = !filterExpanded"
        >
          筛选条件{{ activeFilterCount > 0 ? ' (' + activeFilterCount + ')' : '' }}
          <el-icon class="toggle-icon" :class="{ 'is-expanded': filterExpanded }">
            <ArrowDown />
          </el-icon>
        </el-button>
      </div>

      <div class="filter-controls" :class="{ 'is-expanded': filterExpanded }">
        <el-select
          v-model="localFilters.mkt"
          placeholder="选择地区"
          clearable
          class="filter-select"
          @change="onFilterChange"
        >
          <el-option
            v-for="m in markets"
            :key="m"
            :label="marketLabels[m] || m"
            :value="m"
          />
        </el-select>

        <el-select
          v-model="localFilters.year"
          placeholder="选择年份"
          clearable
          class="filter-select"
          @change="onYearChange"
        >
          <el-option
            v-for="y in years"
            :key="y"
            :label="y + ' 年'"
            :value="y"
          />
        </el-select>

        <el-select
          v-model="localFilters.month"
          placeholder="选择月份"
          clearable
          :disabled="!localFilters.year"
          class="filter-select"
          @change="onFilterChange"
        >
          <el-option
            v-for="m in availableMonths"
            :key="m"
            :label="m + ' 月'"
            :value="m"
          />
        </el-select>

        <el-input
          v-model="localFilters.keyword"
          placeholder="关键词搜索"
          clearable
          :prefix-icon="Search"
          class="filter-search"
          @keyup.enter="onFilterChange"
          @clear="onFilterChange"
        />

        <el-button type="primary" :icon="Search" @click="onFilterChange">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </div>

      <div v-if="hasActiveFilters" class="filter-tags">
        <span class="filter-tags-label">当前筛选：</span>
        <el-tag
          v-if="localFilters.mkt"
          closable
          class="filter-tag"
          @close="clearFilter('mkt')"
        >
          地区：{{ marketLabels[localFilters.mkt] || localFilters.mkt }}
        </el-tag>
        <el-tag
          v-if="localFilters.year"
          closable
          class="filter-tag"
          @close="clearFilter('year')"
        >
          年份：{{ localFilters.year }}
        </el-tag>
        <el-tag
          v-if="localFilters.month"
          closable
          class="filter-tag"
          @close="clearFilter('month')"
        >
          月份：{{ localFilters.month }}
        </el-tag>
        <el-tag
          v-if="localFilters.keyword"
          closable
          class="filter-tag"
          @close="clearFilter('keyword')"
        >
          关键词：{{ localFilters.keyword }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { Search, ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  filters: { type: Object, required: true },
  markets: { type: Array, default: () => [] },
  years: { type: Array, default: () => [] },
  yearMonths: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['change', 'reset'])

const marketLabels = {
  'de-DE': '德国',
  'en-CA': '加拿大',
  'en-GB': '英国',
  'en-IN': '印度',
  'en-US': '美国',
  'es-ES': '西班牙',
  'fr-FR': '法国',
  'it-IT': '意大利',
  'ja-JP': '日本',
  'pt-BR': '巴西',
  'zh-CN': '中国',
}

// 使用本地副本避免直接修改 props
const localFilters = reactive({
  mkt: props.filters.mkt,
  year: props.filters.year,
  month: props.filters.month,
  keyword: props.filters.keyword ?? '',
})

// 当父组件外部更新 filters（如重置）时同步到本地
watch(
  () => [props.filters.mkt, props.filters.year, props.filters.month, props.filters.keyword],
  ([mkt, year, month, keyword]) => {
    localFilters.mkt = mkt
    localFilters.year = year
    localFilters.month = month
    localFilters.keyword = keyword ?? ''
  },
)

const filterExpanded = ref(false)

const availableMonths = computed(() => {
  if (!localFilters.year) return []
  return props.yearMonths[localFilters.year] || []
})

const hasActiveFilters = computed(() => {
  return localFilters.mkt || localFilters.year || localFilters.month || localFilters.keyword
})

const activeFilterCount = computed(() => {
  let count = 0
  if (localFilters.mkt) count++
  if (localFilters.year) count++
  if (localFilters.month) count++
  if (localFilters.keyword) count++
  return count
})

function onYearChange() {
  localFilters.month = null
  onFilterChange()
}

function onFilterChange() {
  emit('change', { ...localFilters })
}

function clearFilter(key) {
  localFilters[key] = key === 'keyword' ? '' : null
  if (key === 'year') localFilters.month = null
  onFilterChange()
}

function onReset() {
  localFilters.mkt = null
  localFilters.year = null
  localFilters.month = null
  localFilters.keyword = ''
  filterExpanded.value = false
  emit('reset')
}
</script>

<style scoped>
.filter-bar {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  position: sticky;
  top: 60px;
  z-index: 99;
}

.filter-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
}

/* 移动端筛选开关（桌面端隐藏） */
.filter-toggle-row {
  display: none;
}

.filter-toggle-btn {
  width: 100%;
  justify-content: space-between;
}

.toggle-icon {
  transition: transform 0.25s ease;
}

.toggle-icon.is-expanded {
  transform: rotate(180deg);
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.filter-select {
  width: 150px;
}

.filter-search {
  width: 280px;
}

.filter-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.filter-tags-label {
  font-size: 13px;
  color: #909399;
}

.filter-tag {
  border-radius: 4px;
}

@media (max-width: 768px) {
  /* 显示移动端筛选开关 */
  .filter-toggle-row {
    display: block;
  }

  /* 移动端默认收起筛选控件 */
  .filter-controls:not(.is-expanded) {
    display: none;
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
    margin-top: 12px;
  }

  .filter-select,
  .filter-search {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .toggle-icon {
    transition: none;
  }
}
</style>
