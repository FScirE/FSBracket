<script setup lang="ts">
import { ref } from 'vue'
import { teamList, matchList, type Team, makeId } from '@/assets/global';
import TeamCardC from './cards/TeamCardC.vue';
import TeamModalC from './modals/TeamModalC.vue';

const selectedTeams = ref<Team[]>([])

function onClickTeam(team: Team) {
  const index = selectedTeams.value.indexOf(team)
  if (index != -1)
    selectedTeams.value.splice(index, 1)
  else
    selectedTeams.value.push(team)
  if (selectedTeams.value.length > 2) // keep max 2 selected
    selectedTeams.value.shift()
}

function addMatch() {
  if (!selectedTeams.value[0] || !selectedTeams.value[1])
    return
  matchList.value.push({
    id: makeId("m"),
    posX: 0,
    posY: 0,
    team1: {
      source: { type: "team", teamId: selectedTeams.value[0].id },
      score: 0
    },
    team2: {
      source: { type: "team", teamId: selectedTeams.value[1].id },
      score: 0
    }
  })
  selectedTeams.value = []
}
</script>

<template>
<div class="collapse collapse-horizontal show" id="collapse-sidebar">
  <div class="sidebar p-3">
    <h2 class="pb-3 mb-3 mt-1">Teams <i class="pi pi-users ms-3"></i></h2>
    <div class="team-list my-4 pr-1">
      <div
        class="team-item mx-3"
        v-for="(team, index) in teamList"
        :key="index"
        :class="{ 'selected-team' : selectedTeams.indexOf(team) != -1 }"
        @click="onClickTeam(team)"
      >
        <TeamCardC
          :team="team"
        />
      </div>
    </div>
    <div class="bottom-section my-3">
      <button class="btn btn-primary p-2 mt-4" type="button" data-bs-toggle="modal" data-bs-target="#team-modal">
        <i class="pi pi-plus"></i>
        <span class="ms-2">Team</span>
      </button>
      <button class="btn btn-primary p-2 mt-4" type="button" :disabled="selectedTeams.length < 2" @click="addMatch">
        <i class="pi pi-plus"></i>
        <span class="ms-2">Match</span>
      </button>
      <TeamModalC />
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
}
.sidebar h2 {
  border-bottom: 1px solid var(--color-border-hover);
}
#collapse-sidebar {
  box-shadow: -1px 0 9px var(--color-shadow);
  border-right: 1px solid var(--color-border);
  clip-path: inset(0 -10px 0 0);
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
  border: 2px solid transparent;
  overflow: hidden;
  box-shadow: 0 0 10px -4px var(--color-border-hover);
}
.team-item:hover {
  cursor: pointer;
}
.selected-team {
  border: 2px solid var(--purple-primary);
}

.bottom-section {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  border-top: 1px solid var(--color-border-hover);
}
.bottom-button button {
  width: fit-content;
}
</style>