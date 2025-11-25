<script setup lang="ts">
import { teamList } from '@/assets/global';
import TeamCardC from './TeamCardC.vue';
</script>

<template>
<div class="collapse collapse-horizontal show" id="collapse-sidebar">
  <div class="sidebar p-3">
    <h2 class="pb-3 mb-3 mt-1">Teams</h2>
    <div class="team-list my-4 pr-1">
      <div
        class="team-item mx-3"
        v-for="(team, index) in teamList"
        :key="index"
      >
        <TeamCardC
          :team="team"
        />
      </div>
    </div>
    <div class="bottom-section my-3">
      <button class="btn p-2 mt-4" type="button">
        <span class="me-2">New</span>
        <i class="pi pi-plus"></i>
      </button>
    </div>
  </div>
</div>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 340px;
  height: 100%;
  background-color: var(--color-background-soft);
  box-shadow: -1px 0 9px var(--color-shadow);
  clip-path: inset(0 -10px 0 0);
}
.sidebar h2 {
  border-bottom: 1px solid var(--color-border-hover);
}

.team-list {
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
}

.team-item {
  flex: 0 0 auto;
  border-radius: 0.5rem;
  overflow: hidden;
}

.bottom-section {
  width: 100%;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--color-border-hover);
}
.bottom-button button {
  width: fit-content;
}
</style>