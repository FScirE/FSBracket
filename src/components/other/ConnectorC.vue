<script setup lang="ts">
import type { Match, Line } from '@/assets/types'
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

    const midRange = 16

    let color: string;

    let cXS: number;
    let cYS = s.posY + sourceElement.clientHeight / 2;

    let cXT: number;
    let cYT = t.posY + targetElement.clientHeight / 2;

    // Case 1: same x-coordinates
    if (Math.abs(t.posX - s.posX) < midRange) {
      color = "red"
      cXS = cXT = t.posX + targetElement.clientWidth / 2
      // Change source and target y-coordinates
      if (t.posY > s.posY) {
        cYS = s.posY + sourceElement.clientHeight
        cYT = t.posY
      }
      else if (t.posY < s.posY) {
        cYS = s.posY
        cYT = t.posY + targetElement.clientHeight
      }
    }
    // Case 2: target.x > source.x but still overlap
    else if (t.posX > s.posX && s.posX + sourceElement.clientWidth > t.posX) {
      color = "yellow"
      cXS = s.posX + sourceElement.clientWidth
      cXT = t.posX
    }
    // Case 3: target.x > source.x and no overlap
    else if (s.posX + sourceElement.clientWidth <= t.posX) {
      color = "white"
      cXS = s.posX + sourceElement.clientWidth
      cXT = t.posX
    }
    // Case 4: target x < source.x but still overlap
    else if (t.posX < s.posX && t.posX + targetElement.clientWidth > s.posX) {
      color = "purple"
      cXS = s.posX
      cXT = t.posX + targetElement.clientWidth
    }
    // Case 5: target x < source.x and no overlap
    else {
      color = "blue"
      cXS = s.posX
      cXT = t.posX + targetElement.clientWidth
    }

    lines.value.push({
      x1: cXS,
      y1: cYS,
      x2: cXT,
      y2: cYT,
      width: 2,
      color: color
    })
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
>
</line>
</template>

<style scoped>
.connector {
  transition: transform 0.1s ease-out;
}
</style>
