<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { fitCanvas, matchList, reloadKey, ZOOM_SENS } from '@/assets/global'
import type { Match } from "@/assets/types"
import MatchCardC from '@/components/cards/MatchCardC.vue'
import MatchModalC from '@/components/modals/MatchModalC.vue'
import { Modal } from 'bootstrap'
import ConnectorC from '@/components/other/ConnectorC.vue'
import CanvasMenuC from '@/components/other/CanvasMenuC.vue'

defineProps<{
  sending: boolean
}>()

const emit = defineEmits<{
  (e: "send:start", value: { which: "winner" | "loser", match: Match }): void,
  (e: "send:finish", value: Match): void
}>()

const mainAreaRef = ref<HTMLElement | null>(null)
const isDraggingArea = ref<boolean>(false)
const dragStartY = ref<number>(0)
const dragStartX = ref<number>(0)
const offsetX = ref<number>(0)
const offsetY = ref<number>(0)
const scale = ref<number>(1)

const selectedMatchId = ref<string>("")

const transformStyle = computed(() => {
  if (!fitCanvas.value)
    return ({ transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})` })
  else
    return (getFitStyle())
})

const showLoser = ref<boolean>(localStorage.getItem("showLoser") == "1")
watch(showLoser, show => {
  localStorage.setItem("showLoser", show ? "1" : "0")
})

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

function getFitStyle() {
  if (!mainAreaRef.value)
    return {}

  const rect = mainAreaRef.value.getBoundingClientRect()
  const card = mainAreaRef.value.querySelector(".match-card")
  if (!card)
    return {}

  // Get dimensions of a match card
  const cardRect = card.getBoundingClientRect()
  const cardWidth = cardRect.width / scale.value
  const cardHeight = cardRect.height / scale.value

  // Get desired canvas width
  const minCardX = Math.min(...matchList.value.map(m => m.posX))
  const maxCardX = Math.max(...matchList.value.map(m => m.posX + cardWidth))
  const desiredWidth = Math.round(maxCardX - minCardX)
  // Get desired canvas height
  const minCardY = Math.min(...matchList.value.map(m => m.posY))
  const maxCardY = Math.max(...matchList.value.map(m => m.posY + cardHeight))
  const desiredHeight = Math.round(maxCardY - minCardY)

  // Get scale needed to fit
  const widthScale = rect.width / desiredWidth
  const heightScale = rect.height / desiredHeight
  const desiredScale = Math.min(widthScale, heightScale)

  return {
    transform: `scale(${desiredScale}) translate(${-minCardX}px, ${-minCardY}px)`,
    width: `${desiredWidth * desiredScale}px`,
    height: `${desiredHeight * desiredScale}px`
  }
}
</script>

<template>
<div
  class="mainarea"
  id="mainarea"
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
    :style="transformStyle"
    :key="reloadKey"
  >
    <MatchCardC
      v-for="(match, index) in matchList"
      :key="index"
      :match="match"
      :scale="scale"
      :sending="sending"
      @match:edit="openMatchModal(match)"
      @match:send="(which) => emit('send:start', { which: which, match: match })"
      @match:click="emit('send:finish', match)"
    />
  </div>
  <svg
    class="connectors"
    :key="reloadKey + (showLoser ? 1 : 0)"
  >
    <ConnectorC
      v-for="(match, index) in matchList"
      :key="index"
      :match="match"
      :transformStyle="transformStyle"
      :showLoser="showLoser"
    />
  </svg>
</div>
<CanvasMenuC
  v-model:offsetX="offsetX"
  v-model:offsetY="offsetY"
  v-model:scale="scale"
  v-model:showLoser="showLoser"
/>
<MatchModalC
 :match-id="selectedMatchId"
/>
</template>

<style scoped>
.mainarea {
  position: relative;
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
  z-index: 1;
  transform-origin: 0 0;
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.1s ease-out;
  will-change: transform;
}

.connectors {
  z-index: 0;
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
