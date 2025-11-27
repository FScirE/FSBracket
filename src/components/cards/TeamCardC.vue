<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Team } from '@/assets/global';

const props = withDefaults(defineProps<{
  team: Team,
  score?: number | null
}>(), {
  score: null
})

const emit = defineEmits<{
  (e: 'update:score', value: number): void
}>()

const input = ref(props.score ?? 0)

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
    return lum >= 150 ? '#040404' : '#f0f0f0'
  }
  return ''
})

function handleInput() {
  let num = input.value
  // clamp to 0-9
  if (!num || num < 0) {
    input.value = 0
    emit('update:score', 0)
  }
  else if (num > 99) {
    input.value = props.score!
    emit('update:score', props.score!)
  }
  else {
    emit('update:score', num)
  }
}
</script>

<template>
<div class="team-card">
  <div class="team-image">
    <img :src="team.imageUrl" :alt="team.name"></img>
  </div>
  <div
    class="team-name ps-2"
    :style="{ backgroundColor: team.color, color: textColor }"
  >
    <h5>{{ team.name }}</h5>
  </div>
  <div class="team-score" v-if="score !== null">
    <input
      class="fs-4 fw-medium"
      type="number"
      v-model.number="input"
      @input="handleInput"
      @keyup.enter="($event.target as any).blur()"
      min="0"
      max="99">
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
.team-score input {
  all: unset;
  text-align: center;
  cursor: text;
  width: 100%;
  margin: 0;
}
.team-score input::-webkit-outer-spin-button,
.team-score input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}
</style>