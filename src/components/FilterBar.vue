<template>
  <div class="filter-bar">
    <div class="filter-inner">
      <div class="filter-controls">
        <el-select
          v-model="filters.mkt"
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
          v-model="filters.year"
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
          v-model="filters.month"
          placeholder="选择月份"
          clearable
          :disabled="!filters.year"
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
          v-model="filters.keyword"
          placeholder="关键词搜索（需搭配筛选条件）"
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
          v-if="filters.mkt"
          closable
          @close="clearFilter('mkt')"
          class="filter-tag"
        >
          地区：{{ marketLabels[filters.mkt] || filters.mkt }}
        </el-tag>
        <el-tag
          v-if="filters.year"
          closable
          @close="clearFilter('year')"
          class="filter-tag"
        >
          年份：{{ filters.year }}
        </el-tag>
        <el-tag
          v-if="filters.month"
          closable
          @close="clearFilter('month')"
          class="filter-tag"
        >
          月份：{{ filters.month }}
        </el-tag>
        <el-tag
          v-if="filters.keyword"
          closable
          @close="clearFilter('keyword')"
          class="filter-tag"
        >
          关键词：{{ filters.keyword }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

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

const availableMonths = computed(() => {
  if (!props.filters.year) return []
  return props.yearMonths[props.filters.year] || []
})

const hasActiveFilters = computed(() => {
  return props.filters.mkt || props.filters.year || props.filters.month || props.filters.keyword
})

function onYearChange() {
  props.filters.month = null
  onFilterChange()
}

function onFilterChange() {
  emit('change', { ...props.filters })
}

function clearFilter(key) {
  props.filters[key] = key === 'year' ? null : (key === 'month' ? null : null)
  if (key === 'year') props.filters.month = null
  onFilterChange()
}

function onReset() {
  props.filters.mkt = null
  props.filters.year = null
  props.filters.month = null
  props.filters.keyword = ''
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
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-select,
  .filter-search {
    width: 100%;
  }
}
</style>
