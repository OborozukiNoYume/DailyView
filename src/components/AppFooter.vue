<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <p class="footer-text">所有图片均来自必应搜索，仅供学习和个人使用</p>
      <p class="footer-sub">DailyView &copy; {{ year }}</p>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--glass-border);
  padding: 24px;
  text-align: center;
  margin-top: auto;
}

.footer-inner {
  max-width: var(--max-width);
  margin: 0 auto;
}

.footer-text {
  font-size: 13px;
  color: var(--text-secondary);
}

.footer-sub {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-muted);
}
</style>
