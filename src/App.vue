<script setup lang="ts">
import Sidebar from './components/Sidebar.vue';
import MainArea from './components/MainArea.vue'
</script>

<template>
<div id="container">
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="50" height="50" />
    <h1>
      FSBracket
    </h1>
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
}

header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem;
  line-height: 1.5;
  width: 100vw;
  background-color: var(--color-background-mute);
}

main {
  display: flex;
  justify-content: stretch;
}

</style>
