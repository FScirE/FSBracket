<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import Topbar from '@/components/Topbar.vue';
import MainArea from '@/components/MainArea.vue'
import { onMounted } from 'vue';
import { windowWidth } from './assets/global';

onMounted(() => {
  const theme = localStorage.getItem('theme')
  if (!theme) {
    localStorage.setItem('theme', 'dark')
    location.reload()
  }

  window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth
  })
})
</script>

<template>
<div id="container">
  <header>
    <Topbar />
  </header>

  <main>
    <Sidebar />
    <MainArea />
  </main>
</div>
</template>

<style scoped>
#container {
  position: fixed;
  width: 100%;
  height: 100%;
  inset: 0;
  display: flex;
  flex-direction: column;
}

header {
  width: 100%;
}

main {
  display: flex;
  width: 100%;
  flex: 1;
  min-height: 0;
}

@media (max-width: 800px) {
  main {
    flex-direction: column;
  }
}
</style>
