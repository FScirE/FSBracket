<script setup lang="ts">
import { ref } from 'vue'
import { teamList, matchList, ZOOM_SENS, type Match } from '@/assets/global'
import MatchCardC from '@/components/cards/MatchCardC.vue'
import MatchModalC from './modals/MatchModalC.vue'
import { Modal } from 'bootstrap'

const mainAreaRef = ref<HTMLElement | null>(null)
const isDraggingArea = ref<boolean>(false)
const dragStartY = ref<number>(0)
const dragStartX = ref<number>(0)
const offsetX = ref<number>(0)
const offsetY = ref<number>(0)
const scale = ref<number>(1)

const selectedMatchId = ref<string>("")

const sendFrom = ref<Match | null>(null)
const sendTo = ref<Match | null>(null)
const sending = ref<boolean>(false)

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

function openMatchModal(match: Match) {
  selectedMatchId.value = match.id
  const element = document.getElementById("match-modal")
  if (!element)
    return
  const modal = Modal.getOrCreateInstance(element)
  if (!modal)
    return
  modal.show()
}

// enables "sending" mode, and sets which match has its result sent from
function startSend(which: "winner" | "loser", match: Match) {
  sending.value = true
  sendFrom.value = match
  sendTo.value = null
  console.log(`Sending ${which} of ${match.id}`)
}

// disabled "sending" mode, and adds the match sent from as a source to the match sent to
function finishSend(match: Match | null) {
  console.log(`Sending to ${match?.id}`)
  sendTo.value = match
  sending.value = false
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
    id="canvas"
    :style="{transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`}"
  >
    <MatchCardC
      v-for="(match, index) in matchList"
      :key="index"
      :match="match"
      :scale="scale"
      :sending="sending"
      @match:edit="openMatchModal(match)"
      @match:send="(which) => startSend(which, match)"
      @match:click="finishSend(match)"
    />
  </div>
</div>
<MatchModalC
 :match-id="selectedMatchId"
/>
</template>

<style scoped>
.mainarea {
  flex: 1;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  background-color: var(--color-background);
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
