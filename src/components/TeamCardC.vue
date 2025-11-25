<script setup lang="ts">
import type { Team } from '@/assets/global';

const props = withDefaults(defineProps<{
  team: Team,
  score?: number | null
}>(), {
  score: null
})
</script>

<template>
<div class="team-card">
  <div class="team-image">
    <img :src="team.imageUrl" :alt="team.name"></img>
  </div>
  <div class="team-name ps-2">
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
  background-color: var(--color-background-mute);
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
  background-color: var(--purple-primary);
  color: var(--white-dark);
}
.team-score h4 {
  margin: 0;
}
</style>