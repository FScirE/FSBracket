<script setup lang="ts">
import { computed } from 'vue';
import type { Team } from '@/assets/global';

const props = withDefaults(defineProps<{
  team: Team,
  score?: number | null
}>(), {
  score: null
})

const textColor = computed(() => {
  if (props.team.color.startsWith("#")) {
    // get r, g, and b values
    let r, g, b
    let hex = props.team.color.slice(1)
    if (hex.length === 3) {
      r = parseInt(hex[0]! + hex[0], 16)
      g = parseInt(hex[1]! + hex[1], 16)
      b = parseInt(hex[2]! + hex[2], 16)
    }
    else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16)
      g = parseInt(hex.slice(2, 4), 16)
      b = parseInt(hex.slice(4, 6), 16)
    }
    else
      return
    // luminance to determine if white or black text
    const lum = (r * 299 + g * 587 + b * 114) / 1000
    return lum >= 150 ? 'var(--vt-c-indigo)' : 'var(--vt-c-white-dark)'
  }
  return null
})
</script>

<template>
<div class="team-card">
  <div class="team-image">
    <img :src="team.imageUrl" :alt="team.name"></img>
  </div>
  <div
    class="team-name ps-2"
    :style="{ backgroundColor: team.color, color: (textColor ? textColor : '') }"
  >
    <h5>{{ team.name }}</h5>
  </div>
  <div class="team-score" v-if="score !== null">
    <h4>{{ score }}</h4>
  </div>
</div>
</template>

<style scoped>
.team-card {
  flex: 1;
  width: 100%;
  height: fit-content;
  display: grid;
  grid-template-columns: 1fr 4fr auto;
}

.team-image {
  height: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background-color: var(--black-dark);
  color: var(--white-dark)
}
.team-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  overflow: hidden;
}

.team-name {
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
  background-color: var(--color-border-hover);
}
.team-name h5 {
  margin: 0;
}

.team-score {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 2.1rem;
  margin-left: 1px;
  background-color: var(--purple-primary);
  color: var(--white-dark);
}
.team-score h4 {
  margin: 0;
}
</style>