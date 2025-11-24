<script setup lang="ts">
import Sidebar from './components/Sidebar.vue';
import Topbar from './components/Topbar.vue';
import MainArea from './components/MainArea.vue'
import { onMounted } from 'vue';

onMounted(() => {
  const theme = localStorage.getItem('theme')
  if (!theme) {
    localStorage.setItem('theme', 'dark')
    location.reload()
  }
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
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
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
}

</style>
