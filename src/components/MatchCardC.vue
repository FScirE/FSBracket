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

const STICK_RANGE = 12 // threshold for snapping in px

function startDragCard(event: MouseEvent) {
  event.stopPropagation() // hinder area drag
  isDragging.value = true
  dragStartX.value = event.clientX - posX.value
  dragStartY.value = event.clientY - posY.value
  if (cardRef.value !== null)
    cardRef.value!.style.zIndex = "11";
}

function handleMouseMove(event: MouseEvent) {
  if (isDragging.value) {
    let tempX = event.clientX - dragStartX.value
    let tempY = event.clientY - dragStartY.value

    // snap to other cards if close in either x- or y-axis
    const canvas = cardRef.value!.parentElement
    if (canvas) {
      const canvasRect = canvas.getBoundingClientRect()

      const others = canvas.querySelectorAll('.match-card')
      others.forEach(e => {
        if (e === cardRef.value)
          return

        const r = e.getBoundingClientRect()
        const otherX = r.left - canvasRect.left
        const otherY = r.top - canvasRect.top

        if (Math.abs(tempX - otherX) <= STICK_RANGE)
          tempX = otherX
        if (Math.abs(tempY - otherY) <= STICK_RANGE)
          tempY = otherY
      })
    }

    posX.value = tempX
    posY.value = tempY
  }
}

function stopDragCard() {
  isDragging.value = false
  if (cardRef.value !== null)
    cardRef.value!.style.zIndex = "10";
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
  height: auto;
  width: 16rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 1px;
  z-index: 10;
}
</style>
