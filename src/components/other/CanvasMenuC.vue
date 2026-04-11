<script setup lang="ts">
import { ZOOM_SENS } from '@/assets/global';

const props = defineProps<{
  offsetX: number,
  offsetY: number,
  scale: number,
  showLoser: boolean
}>()

const emit = defineEmits<{
  (e: "update:offsetX", value: number): void,
  (e: "update:offsetY", value: number): void,
  (e: "update:scale", value: number): void,
  (e: "update:showLoser", value: number): void
}>()

function resetTransforms() {
  emit("update:offsetX", 0)
  emit("update:offsetY", 0)
  emit("update:scale", 1)
}

function zoom(increase: boolean) {
  let newScale = props.scale
  if (increase)
    newScale *= ZOOM_SENS
  else
    newScale /= ZOOM_SENS
  // clamp
  if (newScale < 0.5)
    newScale = 0.5
  else if (newScale > 2)
    newScale = 2

  emit("update:scale", newScale)
}
</script>

<template>
<div class="canvas-menu px-3 py-2">
  <span class="hint">
    <i class="pi pi-cog fs-5"></i>
  </span>

  <button
    class="btn btn-secondary me-3"
    @click="resetTransforms"
    title="Reset"
  >
    <i class="pi pi-refresh"></i>
    <span class="visually-hidden">Reset</span>
  </button>

  <button
    class="btn btn-secondary me-2"
    @click="zoom(true)"
    title="Zoom in"
  >
    <i class="pi pi-plus"></i>
    <span class="visually-hidden">Zoom in</span>
  </button>
  <button
    class="btn btn-secondary me-2"
    @click="zoom(false)"
    title="Zoom out"
  >
    <i class="pi pi-minus"></i>
    <span class="visually-hidden">Zoom out</span>
  </button>
  <span class="canvas-menu-text py-0">
    {{ Math.round(props.scale * 100) }}%
  </span>
</div>
</template>

<style scoped>
.canvas-menu {
  overflow: hidden;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  background-color: var(--purple-primary);
  border-radius: 0.5rem;
  z-index: 2;
  /* make only 3.5rem when not hovered */
  clip-path: inset(0 0 0 calc(100% - 3.5rem) round 0.5rem);
  transition: clip-path 0.2s ease, background-color 0.15s ease;
}

.canvas-menu:hover {
  clip-path: inset(0 0 0 0);
  background-color: var(--color-background-soft);
}
.canvas-menu:hover > *:not(.hint) {
  opacity: 1;
}
.canvas-menu > *:not(.hint),
.canvas-menu:hover > .hint {
  opacity: 0;
}

.canvas-menu-text {
  transition: opacity 0.15s ease;
}

.hint {
  position: absolute;
  display: flex;
  align-items: center;
  color: var(--white-dark);
  top: 50%;
  right: 1.75rem;
  transform: translate(50%, -50%);
  transition: opacity 0.2s ease;
}
</style>
