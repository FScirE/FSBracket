<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { Team } from '@/assets/types';

const props = withDefaults(defineProps<{
  team: Team | null,
  sourceType: "team" | "match" | "none" | undefined
  score?: number | null
}>(), {
  score: null
})

const emit = defineEmits<{
  (e: 'update:score', value: number): void
}>()

const input = ref<number>(props.score ?? 0)

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

// keep score up to date when changed externally
watch(props, () => {
  input.value = props.score ?? 0
})
</script>

<template>
<div class="team-card" :class="{ 'team-card-placeholder' : team === null }">
  <div class="team-image">
    <img :src="team.imageUrl" :alt="team.name" v-if="team"></img>
  </div>
  <div class="team-name ps-2" :class="{'team-source' : sourceType === 'team'}">
    <h5 v-if="team">{{ team.name }}</h5>
    <p class="fw-medium mb-0" v-else>TBD</p>
  </div>
  <div
    class="team-score"
    v-if="score !== null"
    :style="{ backgroundColor: (team)? '' : 'var(--color-border-hover)'}"
  >
    <input v-if="team"
      class="fs-4 fw-medium"
      type="number"
      v-model.number="input"
      @input="handleInput"
      @keyup.enter="($event.target as any).blur()"
      min="0"
      max="99"
    >
  </div>
</div>
</template>

<style scoped>
.team-card {
  flex: 1;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 4fr auto;
}
.team-card-placeholder {
  filter: brightness(0.8);
}

.team-image {
  height: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  margin-right: 1px;
  background-color: var(--color-border-hover);
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
  overflow-x: hidden;
  flex: 1;
  width: 100%;
  background-color: var(--color-border-hover);
}
.team-name h5 {
  margin: 0;
}
.team-source {
  /*background: linear-gradient(90deg, var(--color-border-hover) 0% 85%, var(--purple-primary) 100%);*/
}

.team-score {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
}
.team-score input::-webkit-outer-spin-button,
.team-score input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}
</style>