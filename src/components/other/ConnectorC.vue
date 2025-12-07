<script setup lang="ts">
import type { Match } from '@/assets/types'
import { getMatchIndexById, matchList } from '@/assets/global';
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  match: Match,
  offsetX: number,
  offsetY: number,
  scale: number
}>()

const target = ref<{ x: number, y: number } | null>(null)
const sources = ref<[{ x: number, y: number } | null, { x: number, y: number } | null]>([null, null])

const sourceMatch1 = computed(() => props.match.team1.source.type === "match" ? matchList.value[getMatchIndexById(props.match.team1.source.matchId)]! : null)
const sourceMatch2 = computed(() => props.match.team2.source.type === "match" ? matchList.value[getMatchIndexById(props.match.team2.source.matchId)]! : null)

function updateCoordinates() {
  const sourceMatches = [] as (Match | null)[]
  sourceMatches[0] = sourceMatch1.value
  sourceMatches[1] = sourceMatch2.value

  const targetElement = document.getElementById(props.match.id)
  if (!targetElement)
    return

  sources.value = [null, null]

  sourceMatches.forEach((s, i) => {
    if (!s)
      return

    const sourceElement = document.getElementById(s.id)
    if (!sourceElement)
      return

    const cX = s.posX + sourceElement.clientWidth
    const cY = s.posY + sourceElement.clientHeight / 2

    sources.value[i] = { x: cX, y: cY }
  })

  const cX = props.match.posX
  const cY = props.match.posY + targetElement.clientHeight / 2

  target.value = { x: cX, y: cY }
}

onMounted(() => updateCoordinates())

watch([props.match, sourceMatch1, sourceMatch2], () => {
  updateCoordinates()
}, {deep: true})
</script>

<template>
<line
  v-if="sources[0] && target"
  class="connector"
  :style="{transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`}"
  :x1="sources[0].x"
  :y1="sources[0].y"
  :x2="target.x"
  :y2="target.y"
  stroke="white"
>
</line>
<line
  v-if="sources[1] && target"
  class="connector"
  :style="{transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`}"
  :x1="sources[1].x"
  :y1="sources[1].y"
  :x2="target.x"
  :y2="target.y"
  stroke="white"
>
</line>
</template>

<style scoped>
.connector {
  stroke: white;
  stroke-width: 1px;
  transition: transform 0.1s ease-out;
  z-index: 9;
}
</style>
