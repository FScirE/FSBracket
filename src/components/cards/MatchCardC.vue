<script setup lang="ts">
import { ref, computed } from 'vue'
import { getTeamFromSource, teamList, STICK_RANGE, MATCH_GAP, type Match } from '@/assets/global';
import TeamCardC from './TeamCardC.vue';

const props = defineProps<{
  match: Match,
  scale: number
}>()

const isDragging = ref(false)
const cardRef = ref<HTMLElement | null>(null)
const dragStartX = ref(0)
const dragStartY = ref(0)

const team1 = computed(() => getTeamFromSource(props.match.team1.source))
const team2 = computed(() => getTeamFromSource(props.match.team2.source))

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

  // listen on window
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', stopDragCard)
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

  // snap to other cards
  const others = canvas.querySelectorAll('.match-card')
  others.forEach(e => {
    if (e === cardRef.value)
      return

    const r = e.getBoundingClientRect()
    const otherX = (r.left - canvasRect.left) / props.scale
    const otherY = (r.top - canvasRect.top) / props.scale

    const snapRange = STICK_RANGE / props.scale

    // snap on matching axis (screen)
    if (Math.abs(tempX - otherX) <= snapRange)
      tempX = otherX
    if (Math.abs(tempY - otherY) <= snapRange)
      tempY = otherY

    const thisHeight = cardRef.value!.getBoundingClientRect().height / props.scale
    const otherHeight = r.height / props.scale

    // snap to default gap (local)
    if (tempX === otherX) {
      if(Math.abs(otherY - (tempY + thisHeight) - MATCH_GAP) <= snapRange)
        tempY = otherY - thisHeight - MATCH_GAP
      if (Math.abs(tempY - (otherY + otherHeight) - MATCH_GAP) <= snapRange)
        tempY = otherY + otherHeight + MATCH_GAP
    }
  })

  props.match.posX = tempX
  props.match.posY = tempY
}

function stopDragCard() {
  isDragging.value = false
  if (cardRef.value !== null)
    cardRef.value!.style.zIndex = "10";

  // remove listeners
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', stopDragCard)
}
</script>

<template>
<div
  class="match-card"
  :id="match.id"
  ref="cardRef"
  :style="{ transform: `translate(${props.match.posX}px, ${props.match.posY}px)` }"
  @mousedown="startDragCard"
>
  <TeamCardC
    :team="team1!"
    v-model:score="match.team1.score"
  />
  <TeamCardC
    :team="team2!"
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
