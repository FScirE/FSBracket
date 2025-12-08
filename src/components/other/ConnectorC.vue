<script setup lang="ts">
import type { Match, Line } from '@/assets/types'
import { createLinePath, getMatchIndexById, matchList } from '@/assets/global';
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  match: Match,
  offsetX: number,
  offsetY: number,
  scale: number
}>()

const sourceMatch1 = computed(() => props.match.team1.source.type === "match" ? matchList.value[getMatchIndexById(props.match.team1.source.matchId)]! : null)
const sourceMatch2 = computed(() => props.match.team2.source.type === "match" ? matchList.value[getMatchIndexById(props.match.team2.source.matchId)]! : null)
const source1Bracket = computed(() => props.match.team1.source.type === "match" ? props.match.team1.source.bracket : "winner")
const source2Bracket = computed(() => props.match.team2.source.type === "match" ? props.match.team2.source.bracket : "winner")

const lines = ref<Line[]>([])

function updateCoordinates() {
  const sourceMatches = [] as (Match | null)[]
  sourceMatches[0] = sourceMatch1.value
  sourceMatches[1] = sourceMatch2.value

  const targetElement = document.getElementById(props.match.id)
  if (!targetElement)
    return

  lines.value = []
  const t = props.match

  sourceMatches.forEach((s, i) => {
    if (!s)
      return

    const sourceElement = document.getElementById(s.id)
    if (!sourceElement)
      return

    let color= "var(--color-border-hover)"
    let width = 2.5

    const bracket = i === 0 ? source1Bracket.value : source2Bracket.value
    let dashed = bracket === "loser"

    let cYS: number
    let cXS: number
    let cXT: number
    let cYT: number
    let vertical: boolean

    // Case 1: Target is right of source
    if (s.posX + sourceElement.clientWidth < t.posX) {
      cXS = s.posX + sourceElement.clientWidth
      cYS = s.posY + sourceElement.clientHeight / 2
      cXT = t.posX
      cYT = t.posY + targetElement.clientHeight / 2
      vertical = false
    }
    // Case 2: Target is left of source
    else if (t.posX + targetElement.clientWidth < s.posX) {
      cXS = s.posX
      cYS = s.posY + sourceElement.clientHeight / 2
      cXT = t.posX + targetElement.clientWidth
      cYT = t.posY + targetElement.clientHeight / 2
      vertical = false
    }
    // Case 3: Target is above source
    else if (t.posY + targetElement.clientHeight < s.posY) {
      cXS = s.posX + sourceElement.clientWidth / 2
      cYS = s.posY
      cXT = t.posX + targetElement.clientWidth / 2
      cYT = t.posY + targetElement.clientHeight
      vertical = true
    }
    // Case 4: Target is below source
    else {
      cXS = s.posX + sourceElement.clientWidth / 2
      cYS = s.posY + sourceElement.clientHeight
      cXT = t.posX + targetElement.clientWidth / 2
      cYT = t.posY
      vertical = true
    }

    lines.value = lines.value.concat(createLinePath({ x: cXS, y: cYS }, { x: cXT, y: cYT }, vertical, dashed, color, width))
  })
}

onMounted(() => updateCoordinates())

watch([props.match, sourceMatch1, sourceMatch2], () => {
  updateCoordinates()
}, {deep: true})
</script>

<template>
<line
  v-for="(line, index) in lines"
  :key="index"
  class="connector"
  :style="{transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`}"
  :x1="line.x1"
  :y1="line.y1"
  :x2="line.x2"
  :y2="line.y2"
  :stroke="line.color"
  :stroke-width="line.width"
  :stroke-dasharray="line.dashed ?  `${line.width} ${line.width * 2}` : ''"
>
</line>
</template>

<style scoped>
.connector {
  stroke-linecap: round;
  transition: transform 0.1s ease-out;
}
</style>
