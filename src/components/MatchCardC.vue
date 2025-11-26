<script setup lang="ts">
import { ref } from 'vue'
import type { Match } from '@/assets/global';
import TeamCardC from './TeamCardC.vue';

const props = defineProps<{
  match: Match,
  scale: number
}>()

const isDragging = ref(false)
const cardRef = ref<HTMLElement | null>(null)
const dragStartX = ref(0)
const dragStartY = ref(0)

const STICK_RANGE = 16 // threshold for snapping in px

function startDragCard(event: MouseEvent) {
  event.stopPropagation() // hinder area drag
  isDragging.value = true

  const canvas = cardRef.value?.parentElement
  if (!canvas)
    return
  const canvasRect = canvas.getBoundingClientRect()

  // pointer position in local coordinates
  const pointerLocalX = (event.clientX - canvasRect.left) / props.scale
  const pointerLocalY = (event.clientY - canvasRect.top) / props.scale

  dragStartX.value = pointerLocalX - props.match.posX
  dragStartY.value = pointerLocalY - props.match.posY

  if (cardRef.value !== null)
    cardRef.value!.style.zIndex = "11";
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value)
    return

  const canvas = cardRef.value!.parentElement
  if (!canvas)
    return
  const canvasRect = canvas.getBoundingClientRect()

  // pointer in local coordinates
  const pointerLocalX = (event.clientX - canvasRect.left) / props.scale
  const pointerLocalY = (event.clientY - canvasRect.top) / props.scale

  let tempX = pointerLocalX - dragStartX.value
  let tempY = pointerLocalY - dragStartY.value

  // snap to other cards within range in x- or y-axis
  const others = canvas.querySelectorAll('.match-card')
  others.forEach(e => {
    if (e === cardRef.value)
      return

    const r = e.getBoundingClientRect()
    const otherX = (r.left - canvasRect.left) / props.scale
    const otherY = (r.top - canvasRect.top) / props.scale

    // snapping range is 12px on screen, not local
    if (Math.abs(tempX - otherX) <= STICK_RANGE / props.scale)
      tempX = otherX
    if (Math.abs(tempY - otherY) <= STICK_RANGE / props.scale)
      tempY = otherY
  })

  props.match.posX = tempX
  props.match.posY = tempY
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
  :style="{ transform: `translate(${props.match.posX}px, ${props.match.posY}px)` }"
  @mousedown="startDragCard"
  @mousemove="handleMouseMove"
  @mouseup="stopDragCard"
  @mouseleave="stopDragCard"
>
  <TeamCardC
    :team="match.team1.team"
    v-model:score="match.team1.score"
  />
  <TeamCardC
    :team="match.team2.team"
    v-model:score="match.team2.score"
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
