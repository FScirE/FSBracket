<script setup lang="ts">
import type { Team } from '@/assets/global';

const props = defineProps<{
  team: Team,
  score: number
}>()
</script>

<template>
<div class="team-card">
  <div class="team-name p-1">
    <h4>{{ team.name }}</h4>
  </div>
  <div class="team-score p-1">
    <h4>{{ score }}</h4>
  </div>
</div>
</template>

<style scoped>
.team-card {
  flex: 1;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 5fr 1fr;
}

.team-name {
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
  background-color: var(--color-border-hover);
}
.team-name h4 {
  margin: 0;
}

.team-score {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: var(--purple-primary);
  color: var(--white-dark);
}
.team-score h4 {
  margin: 0;
}
</style>