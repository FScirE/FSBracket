<script setup lang="ts">
</script>

<template>
<Teleport to="body">
  <div class="exporting-overlay">
    <div class="exporting-spinner spinner-border" role="status"></div>
    <h2>Exporting...</h2>
  </div>
</Teleport>
</template>

<style scoped>
.exporting-overlay {
  background-color: var(--color-background);
  z-index: 2003;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.exporting-spinner {
  color: var(--purple-primary);
  font-size: 3rem;
  width: 8rem;
  height: 8rem;
}
</style>
