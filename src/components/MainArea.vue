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
</script>

<template>
<div
  class="mainarea"
  ref="mainAreaRef"
  @mousedown="startDragArea"
  @mousemove="handleMouseMove"
  @mouseup="stopDragArea"
  @mouseleave="stopDragArea"
>
  <div
    class="canvas"
    :style="{ transform: `translate(${offsetX}px, ${offsetY}px)` }"
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
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.1s ease-out;
}
</style>
