<script setup lang="ts">
import { dashedLinesList, matchList } from '@/assets/global'
import { computed } from 'vue'

const props = defineProps<{
  scale: number
}>()

const maskDimensions = computed(() => {
  const card = document.querySelector(".match-card")
  if (!card)
    return { x: 0, y: 0, width: 1, height: 1 }

  // Get dimensions of a match card
  const cardRect = card.getBoundingClientRect()
  const cardWidth = cardRect.width / props.scale
  const cardHeight = cardRect.height / props.scale

  // Get desired canvas width
  const minCardX = Math.min(...matchList.value.map(m => m.posX))
  const maxCardX = Math.max(...matchList.value.map(m => m.posX + cardWidth))
  const width = Math.round(maxCardX - minCardX)
  // Get desired canvas height
  const minCardY = Math.min(...matchList.value.map(m => m.posY))
  const maxCardY = Math.max(...matchList.value.map(m => m.posY + cardHeight))
  const height = Math.round(maxCardY - minCardY)

  return {
    x: minCardX,
    y: minCardY,
    width: width,
    height: height
  }
})
</script>

<template>
<defs>
  <mask
    id="mask"
    maskUnits="userSpaceOnUse"
    maskContentUnits="userSpaceOnUse"
  >
    <rect
      :x="maskDimensions.x"
      :y="maskDimensions.y"
      :width="maskDimensions.width"
      :height="maskDimensions.height"
      fill="white">
    </rect>

    <line
      v-for="(line, index) in [...Object.values(dashedLinesList).flat()]"
      :key="index"
      class="connector"
      :x1="line.x1"
      :y1="line.y1"
      :x2="line.x2"
      :y2="line.y2"
      stroke="black"
      :stroke-width="line.width + 1"
    >
    </line>
  </mask>
</defs>
</template>

<style scoped>
</style>