<template>
  <div class="filter-bar">
    <div class="filter-inner">
      <!-- Mobile toggle -->
      <div class="filter-toggle-row">
        <button class="btn btn-ghost filter-toggle-btn" @click="filterExpanded = !filterExpanded">
          <IconFilter class="btn-icon-svg" />
          筛选条件{{ activeFilterCount > 0 ? ' (' + activeFilterCount + ')' : '' }}
          <IconArrowDown class="toggle-chevron" :class="{ 'is-expanded': filterExpanded }" />
        </button>
      </div>

      <div class="filter-controls" :class="{ 'is-expanded': filterExpanded }">
        <!-- Region select -->
        <div class="custom-select" ref="mktSelectRef">
          <button
            class="select-trigger"
            :class="{ 'has-value': localFilters.mkt }"
            @click="toggleDropdown('mkt')"
          >
            <span class="select-value">
              {{ localFilters.mkt ? (marketLabels[localFilters.mkt] || localFilters.mkt) : '选择地区' }}
            </span>
            <IconArrowDown class="select-arrow" />
          </button>
          <transition name="dropdown">
            <div v-if="openDropdown === 'mkt'" class="select-dropdown">
              <div class="select-option" @click="selectOption('mkt', null)">全部地区</div>
              <div
                v-for="m in markets"
                :key="m"
                class="select-option"
                :class="{ 'is-active': localFilters.mkt === m }"
                @click="selectOption('mkt', m)"
              >
                {{ marketLabels[m] || m }}
              </div>
            </div>
          </transition>
        </div>

        <!-- Year select -->
        <div class="custom-select" ref="yearSelectRef">
          <button
            class="select-trigger"
            :class="{ 'has-value': localFilters.year }"
            @click="toggleDropdown('year')"
          >
            <span class="select-value">
              {{ localFilters.year ? localFilters.year + ' 年' : '选择年份' }}
            </span>
            <IconArrowDown class="select-arrow" />
          </button>
          <transition name="dropdown">
            <div v-if="openDropdown === 'year'" class="select-dropdown">
              <div class="select-option" @click="selectOption('year', null)">全部年份</div>
              <div
                v-for="y in years"
                :key="y"
                class="select-option"
                :class="{ 'is-active': localFilters.year === y }"
                @click="selectOption('year', y)"
              >
                {{ y }} 年
              </div>
            </div>
          </transition>
        </div>

        <!-- Month select -->
        <div class="custom-select" ref="monthSelectRef">
          <button
            class="select-trigger"
            :class="{ 'has-value': localFilters.month }"
            :disabled="!localFilters.year"
            @click="toggleDropdown('month')"
          >
            <span class="select-value">
              {{ localFilters.month ? localFilters.month + ' 月' : '选择月份' }}
            </span>
            <IconArrowDown class="select-arrow" />
          </button>
          <transition name="dropdown">
            <div v-if="openDropdown === 'month'" class="select-dropdown">
              <div class="select-option" @click="selectOption('month', null)">全部月份</div>
              <div
                v-for="m in availableMonths"
                :key="m"
                class="select-option"
                :class="{ 'is-active': localFilters.month === m }"
                @click="selectOption('month', m)"
              >
                {{ m }} 月
              </div>
            </div>
          </transition>
        </div>

        <!-- Search input -->
        <div class="search-input-wrapper">
          <IconSearch class="search-icon" />
          <input
            v-model="localFilters.keyword"
            type="text"
            class="search-input"
            placeholder="关键词搜索"
            @keyup.enter="onFilterChange"
          />
          <button v-if="localFilters.keyword" class="search-clear" @click="clearKeyword">
            <IconClose class="clear-icon" />
          </button>
        </div>

        <button class="btn btn-primary btn-sm" @click="onFilterChange">
          <IconSearch class="btn-icon-svg" />
          搜索
        </button>
        <button class="btn btn-ghost btn-sm" @click="onReset">重置</button>
      </div>

      <!-- Active filter tags -->
      <div v-if="hasActiveFilters" class="filter-tags">
        <span class="filter-tags-label">当前筛选：</span>
        <span v-if="localFilters.mkt" class="filter-tag">
          地区：{{ marketLabels[localFilters.mkt] || localFilters.mkt }}
          <button class="tag-close" @click="clearFilter('mkt')"><IconClose class="tag-close-icon" /></button>
        </span>
        <span v-if="localFilters.year" class="filter-tag">
          年份：{{ localFilters.year }}
          <button class="tag-close" @click="clearFilter('year')"><IconClose class="tag-close-icon" /></button>
        </span>
        <span v-if="localFilters.month" class="filter-tag">
          月份：{{ localFilters.month }}
          <button class="tag-close" @click="clearFilter('month')"><IconClose class="tag-close-icon" /></button>
        </span>
        <span v-if="localFilters.keyword" class="filter-tag">
          关键词：{{ localFilters.keyword }}
          <button class="tag-close" @click="clearFilter('keyword')"><IconClose class="tag-close-icon" /></button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import IconSearch from './icons/IconSearch.vue'
import IconArrowDown from './icons/IconArrowDown.vue'
import IconClose from './icons/IconClose.vue'
import IconFilter from './icons/IconFilter.vue'

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

const localFilters = reactive({
  mkt: props.filters.mkt,
  year: props.filters.year,
  month: props.filters.month,
  keyword: props.filters.keyword ?? '',
})

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
const openDropdown = ref(null)
const mktSelectRef = ref(null)
const yearSelectRef = ref(null)
const monthSelectRef = ref(null)

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

function toggleDropdown(name) {
  openDropdown.value = openDropdown.value === name ? null : name
}

function selectOption(key, value) {
  localFilters[key] = value
  if (key === 'year') localFilters.month = null
  openDropdown.value = null
  onFilterChange()
}

function clearKeyword() {
  localFilters.keyword = ''
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
  openDropdown.value = null
  emit('reset')
}

// Close dropdown on outside click
function onClickOutside(e) {
  if (openDropdown.value === null) return
  const refs = [mktSelectRef.value, yearSelectRef.value, monthSelectRef.value]
  const inside = refs.some(r => r && r.contains(e.target))
  if (!inside) openDropdown.value = null
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.filter-bar {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--glass-border);
  position: sticky;
  top: var(--header-height);
  z-index: 99;
}

.filter-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 14px 24px;
}

/* Mobile toggle */
.filter-toggle-row {
  display: none;
}

.filter-toggle-btn {
  width: 100%;
  justify-content: space-between;
}

.btn-icon-svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.toggle-chevron {
  width: 14px;
  height: 14px;
  transition: transform 0.25s ease;
}

.toggle-chevron.is-expanded {
  transform: rotate(180deg);
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

/* Custom Select */
.custom-select {
  position: relative;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  min-width: 140px;
  height: 36px;
  padding: 0 12px;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

.select-trigger:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
}

.select-trigger.has-value .select-value {
  color: var(--text-primary);
}

.select-trigger:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.select-arrow {
  width: 14px;
  height: 14px;
  color: var(--text-muted);
  transition: transform 0.2s;
  flex-shrink: 0;
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 100%;
  max-height: 240px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border-hover);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-elevated);
  z-index: 100;
  padding: 4px;
}

.select-option {
  padding: 8px 14px;
  font-size: 13px;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.select-option:hover {
  background: var(--glass-bg-hover);
  color: var(--text-primary);
}

.select-option.is-active {
  background: var(--accent-glow);
  color: var(--accent-bright);
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s var(--ease-out);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Search input */
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 260px;
}

.search-icon {
  position: absolute;
  left: 10px;
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 32px 0 34px;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 13px;
  transition: all var(--duration-fast) var(--ease-out);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
  outline: none;
}

.search-clear {
  position: absolute;
  right: 6px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: color var(--duration-fast);
}

.search-clear:hover {
  color: var(--text-primary);
}

.clear-icon {
  width: 14px;
  height: 14px;
}

/* Filter tags */
.filter-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.filter-tags-label {
  font-size: 13px;
  color: var(--text-muted);
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--accent-glow);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: var(--radius-full);
  font-size: 12px;
  color: var(--accent-bright);
}

.tag-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  color: var(--accent);
  transition: background var(--duration-fast);
}

.tag-close:hover {
  background: rgba(99, 102, 241, 0.2);
}

.tag-close-icon {
  width: 10px;
  height: 10px;
}

@media (max-width: 768px) {
  .filter-toggle-row {
    display: block;
  }

  .filter-controls:not(.is-expanded) {
    display: none;
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
    margin-top: 12px;
  }

  .custom-select {
    width: 100%;
  }

  .select-trigger {
    width: 100%;
    min-width: unset;
  }

  .search-input-wrapper {
    width: 100%;
  }

  .filter-inner {
    padding: 12px 16px;
  }
}
</style>
