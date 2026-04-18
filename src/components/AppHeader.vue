<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-left">
        <h1 class="logo" @click="$emit('home')">
          <el-icon :size="24"><PictureFilled /></el-icon>
          DailyView
        </h1>
      </div>
      <nav class="header-nav">
        <el-link :underline="false" class="nav-link" @click="$emit('home')">首页</el-link>
      </nav>
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
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  user-select: none;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85) !important;
  font-size: 15px;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #fff !important;
}
</style>
