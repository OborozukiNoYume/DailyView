<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-left">
        <h1 class="logo">
          <a
            href="#"
            class="logo-link"
            aria-label="DailyView 重置筛选"
            @click.prevent="$emit('home')"
          >
            <el-icon :size="24"><PictureFilled /></el-icon>
            DailyView
          </a>
        </h1>
      </div>
    </div>
  </header>
</template>

<script setup>
defineEmits(['home'])
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.3);
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  user-select: none;
  margin: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-decoration: none;
}

.logo-link:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 4px;
  border-radius: 4px;
}
</style>
