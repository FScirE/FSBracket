<script setup lang="ts">
import { ref } from 'vue'
import type { Match } from '@/assets/global';
import TeamCardC from './TeamCardC.vue';

const props = defineProps<{
  match: Match
}>()

const isDragging = ref(false)
const cardRef = ref<HTMLElement | null>(null)
const posX = ref(0)
const posY = ref(0)
const dragStartX = ref(0)
const dragStartY = ref(0)

function startDragCard(event: MouseEvent) {
  event.stopPropagation() // hinder area drag
  isDragging.value = true
  dragStartX.value = event.clientX - posX.value
  dragStartY.value = event.clientY - posY.value
}

function handleMouseMove(event: MouseEvent) {
  if (isDragging.value) {
    posX.value = event.clientX - dragStartX.value
    posY.value = event.clientY - dragStartY.value
  }
}

function stopDragCard() {
  isDragging.value = false
}
</script>

<template>
<div
  class="match-card"
  ref="cardRef"
  :style="{ transform: `translate(${posX}px, ${posY}px)` }"
  @mousedown="startDragCard"
  @mousemove="handleMouseMove"
  @mouseup="stopDragCard"
  @mouseleave="stopDragCard"
>
  <TeamCardC
    :team="match.team1.team"
    :score="match.team1.score"
  />
  <TeamCardC
    :team="match.team2.team"
    :score="match.team2.score"
  />
</div>
</template>

<style scoped>
.match-card {
  position: absolute;
  height: 6rem;
  width: 14rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 1px;
}
</style>
