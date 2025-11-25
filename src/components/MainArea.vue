<script setup lang="ts">
import { ref } from 'vue'
import { teamList, matchList } from '@/assets/global'
import MatchCardC from './MatchCardC.vue'

const mainAreaRef = ref<HTMLElement | null>(null)
const isDraggingArea = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const offsetX = ref(0)
const offsetY = ref(0)
const scale = ref(1)

const ZOOM_SENS = 1.10

function startDragArea(event: MouseEvent) {
  isDraggingArea.value = true
  dragStartX.value = event.clientX - offsetX.value
  dragStartY.value = event.clientY - offsetY.value
}

function handleMouseMove(event: MouseEvent) {
  if (isDraggingArea.value && mainAreaRef.value !== null) {
    offsetX.value = event.clientX - dragStartX.value
    offsetY.value = event.clientY - dragStartY.value
  }
}

function stopDragArea() {
  isDraggingArea.value = false
}

function handleZoomArea(event: WheelEvent) {
  if (!mainAreaRef.value)
    return

  const mouseX = event.clientX
  const mouseY = event.clientY

  const rect = mainAreaRef.value.getBoundingClientRect()

  // get mouse position relative to main area
  const x = mouseX - rect.left
  const y = mouseY - rect.top

  // get new scale
  let newScale = scale.value
  if (event.deltaY < 0)
    newScale *= ZOOM_SENS
  else
    newScale /= ZOOM_SENS
  // clamp
  if (newScale < 0.5)
    newScale = 0.5
  else if (newScale > 2)
    newScale = 2

  // change offset to center zoom
  offsetX.value = x - (x - offsetX.value) * (newScale / scale.value)
  offsetY.value = y - (y - offsetY.value) * (newScale / scale.value)

  scale.value = newScale
}
</script>

<template>
<div
  class="mainarea"
  ref="mainAreaRef"
  @mousedown="startDragArea"
  @mousemove="handleMouseMove"
  @mouseup="stopDragArea"
  @mouseleave="stopDragArea"
  @wheel.prevent="handleZoomArea"
>
  <div
    class="canvas"
    :style="{transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`}"
  >
    <MatchCardC
      v-for="(match, index) in matchList"
      :key="index"
      :match="match"
    />
  </div>
</div>
</template>

<style scoped>
.mainarea {
  flex: 1;
  overflow: hidden;
  cursor: grab;
  user-select: none;
}

.mainarea:active {
  cursor: grabbing;
}

.canvas {
  transform-origin: 0 0;
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.1s ease-out;
}
</style>
