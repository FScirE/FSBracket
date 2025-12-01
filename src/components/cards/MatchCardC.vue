<script setup lang="ts">
import { ref, computed } from 'vue'
import { getTeamFromSource, teamList, STICK_RANGE, MATCH_GAP, type Match } from '@/assets/global';
import TeamCardC from '@/components/cards/TeamCardC.vue';
import DoubleButtonC from '../other/DoubleButtonC.vue';

const props = defineProps<{
  match: Match,
  scale: number,
  sending: boolean
}>()

const emit = defineEmits<{
  (e: "match:edit", value: void): void,
  (e: "match:send", value: "winner" | "loser"): void,
  (e: "match:click", value: void): void
}>()

const isDragging = ref<boolean>(false)
const cardRef = ref<HTMLElement | null>(null)
const dragStartX = ref<number>(0)
const dragStartY = ref<number>(0)

const team1 = computed(() => getTeamFromSource(props.match.team1.source))
const team2 = computed(() => getTeamFromSource(props.match.team2.source))

function startDragCard(event: MouseEvent) {
  event.stopPropagation() // hinder area drag

  if (props.sending) // dont drag if in "sending" mode
    return

  isDragging.value = true

  const canvas = document.getElementById("canvas")
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

  const canvas = document.getElementById("canvas")
  if (!canvas)
    return
  const canvasRect = canvas.getBoundingClientRect()

  // pointer in local coordinates
  const pointerLocalX = (event.clientX - canvasRect.left) / props.scale
  const pointerLocalY = (event.clientY - canvasRect.top) / props.scale

  let tempX = pointerLocalX - dragStartX.value
  let tempY = pointerLocalY - dragStartY.value

  // snap to other cards
  const others = canvas.querySelectorAll(".match-card")
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

function onMatchClick() {
  // emit only when in "sending" mode
  if (props.sending)
    emit("match:click")
}
</script>

<template>
<div
  class="match-card"
  :class="{ 'sending-mode' : sending }"
  ref="cardRef"
  :style="{ transform: `translate(${props.match.posX}px, ${props.match.posY}px)` }"
  @mousedown="startDragCard"
  @click="onMatchClick"
>
  <!-- teams in match -->
  <div
    class="team-cards"
    :id="match.id"
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
  <!-- edit button -->
  <div
    class="popup popup-left"
    :style="{ '--scale': props.scale }"
  >
    <button
      class="btn btn-primary"
      type="button"
      title="Edit match"
      tabindex="-1"
      @mousedown.stop=""
      @click.stop="emit('match:edit')"
    >
      <span class="visually-hidden">Edit match</span>
      <i class="pi pi-pencil"></i>
    </button>
  </div>
  <!-- forward winner/loser buttons -->
  <div
    class="popup popup-right"
    :style="{ '--scale': props.scale }"
  >
    <button
      class="btn btn-success"
      type="button"
      title="Send winner to..."
      tabindex="-1"
      @mousedown.stop=""
      @click.stop="emit('match:send', 'winner')"
    >
      <span class="visually-hidden">Send winner to...</span>
      <i class="pi pi-trophy"></i>
    </button>
    <button
      class="btn btn-secondary"
      type="button"
      title="Send loser to..."
      tabindex="-1"
      @mousedown.stop=""
      @click.stop="emit('match:send', 'loser')"
    >
      <span>
        <span class="visually-hidden">Send loser to...</span>
        <h5 class="mb-0">L</h5>
      </span>
    </button>
  </div>
</div>
</template>

<style scoped>
.match-card {
  height: auto;
  width: 16rem;
  position: absolute;
}

.team-cards {
  position: relative;
  left: 0;
  top: 0;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 1px;
  z-index: 10;
}
.match-card.sending-mode:hover .team-cards {
  cursor: pointer;
  box-shadow: 0 0 0 2px var(--purple-primary);
}

/* popup button styling */
.popup-right {
  right: -1px;
  transform-origin: left;
  transform: translate(100%, -50%) scale(calc(1 / var(--scale)));
  align-items: start;
}
.popup-left {
  left: -1px;
  transform-origin: right;
  transform: translate(-100%, -50%) scale(calc(1 / var(--scale)));
  align-items: end;
}
.popup {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1px;
  top: 50%;
  height: fit-content;
  width: 2.5rem;
}
.popup button {
  width: 0;
  aspect-ratio: 1;
  padding: 0;
  overflow: hidden;
}
.match-card:not(.sending-mode):hover > .popup button {
  width: 100%;
}
</style>
