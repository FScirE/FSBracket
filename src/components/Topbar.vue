<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { windowWidth } from '@/assets/global'
import * as htmlToImage from 'html-to-image'

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

function downloadAsImage() {
  var node = document.getElementById('canvas');
  if (!node)
    return

  htmlToImage.toPng(node!)
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = 'bracket.png';
      link.href = dataUrl;
      link.click();
    })
    .catch(function (error: Error) {
      console.error('Oops, something went wrong!', error);
    })
}
</script>

<template>
<div class="topbar p-4">
  <div>
    <button
      class="collapse-button btn btn-primary ms-4"
      type="button" data-bs-toggle="collapse"
      data-bs-target="#collapse-sidebar"
      aria-expanded="true"
      aria-controls="collapse-sidebar"
      title="Toggle sidebar"
    >
      <span class="visually-hidden">Toggle sidebar</span>
      <i class="pi fs-4 p-1" :class="windowWidth > 800 ? 'pi-chevron-left' : 'pi-chevron-up'"></i>
    </button>
  </div>
  <div class="d-flex gap-4">
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
    <h1>
      FSBracket
    </h1>
  </div>
  <div class="d-flex gap-3">
    <button class="btn btn-primary me-4" type="button" @click="downloadAsImage" title="Download as image">
      <span class="visually-hidden">Download image</span>
      <i class="pi pi-image fs-4 p-1"></i>
    </button>
    <button class="btn btn-primary me-4" type="button" @click="toggleTheme" title="Toggle theme">
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
  width: 100%;
  background-color: var(--color-background-mute);
  box-shadow: 0 -5px 8px -6px inset var(--color-border);
  border-bottom: 1px solid var(--color-border);
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