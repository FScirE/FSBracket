<script setup lang="ts">
import { onMounted, ref } from 'vue'

const theme = ref<string>('')

onMounted(() => {
  // Get theme
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved)
    theme.value = saved
  }
})

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme')
  const next = current === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', next)
  localStorage.setItem('theme', next)
  theme.value = next
}
</script>

<template>
<div class="topbar">
  <div>
    <button class="collapse-button btn btn-primary ms-4" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-sidebar" aria-expanded="true" aria-controls="collapse-sidebar">
      <span class="visually-hidden">Open sidebar</span>
      <i class="pi pi-chevron-left fs-4 p-1"></i>
    </button>
  </div>
  <div class="d-flex gap-4">
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
    <h1>
      FSBracket
    </h1>
  </div>
  <div>
    <button class="btn btn-primary me-4" type="button" @click="toggleTheme()">
      <span class="visually-hidden">Toggle theme</span>
      <i class="pi fs-4 p-1" :class="(theme === 'dark') ? 'pi-moon' : 'pi-sun'"></i>
    </button>
  </div>
</div>
</template>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem;
  line-height: 1.5;
  width: 100%;
  background-color: var(--color-background-mute);
  box-shadow: 0 -5px 8px -6px inset var(--color-border);
}

button {
  display: flex;
  align-items: center;
}

.collapse-button i {
  transition: transform 0.3s ease;
}
.collapse-button.collapsed i {
  transform: rotate(180deg);
}
</style>