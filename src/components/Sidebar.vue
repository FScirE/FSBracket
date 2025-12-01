<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { teamList, matchList, type Team, makeId, windowWidth, type TeamSource } from '@/assets/global';
import TeamCardC from '@/components/cards/TeamCardC.vue';
import TeamModalC from '@/components/modals/TeamModalC.vue';
import { Modal } from 'bootstrap'

const selectedTeams = ref<Team[]>([])

const teamModalMode = ref<"add" | "edit">("add")
const teamModalId = ref<string>("")

function onClickTeam(team: Team) {
  const index = selectedTeams.value.indexOf(team)
  if (index != -1)
    selectedTeams.value.splice(index, 1)
  else
    selectedTeams.value.push(team)
  if (selectedTeams.value.length > 2) // keep max 2 selected
    selectedTeams.value.shift()
}

function openTeamModal() {
  const element = document.getElementById("team-modal")
  if (!element)
    return
  const modal = Modal.getOrCreateInstance(element)
  if (!modal)
    return
  modal.show()
}
function openTeamEdit(team: Team) {
  teamModalMode.value = "edit"
  teamModalId.value = team.id
  openTeamModal()
}
function openTeamAdd() {
  teamModalMode.value = "add"
  teamModalId.value = ""
  openTeamModal()
}

function addMatch() {
  let team1: {
    source: TeamSource,
    score: number
  }
  let team2: typeof team1

  // set team 1
  if (!selectedTeams.value[0]) {
    team1 = {
      source: { type: "none" },
      score: 0
    }
  }
  else {
    team1 = {
      source: { type: "team", teamId: selectedTeams.value[0].id },
      score: 0
    }
  }
  // set team 2
  if (!selectedTeams.value[1]) {
    team2 = {
      source: { type: "none" },
      score: 0
    }
  }
  else {
    team2 = {
      source: { type: "team", teamId: selectedTeams.value[1].id },
      score: 0
    }
  }

  matchList.value.push({
    id: makeId("m"),
    posX: 0,
    posY: 0,
    team1: team1,
    team2: team2
  })
  selectedTeams.value = []
}
</script>

<template>
<div class="collapse show" id="collapse-sidebar" ref="sidebarElement" :class="{ 'collapse-horizontal' : windowWidth > 800 }">
  <div class="sidebar p-3">
    <h2 class="pb-3 mb-3 mt-1">Teams <i class="pi pi-users ms-3"></i></h2>
    <div class="team-list my-4 pr-1" @click="selectedTeams = []">
      <div
        class="team-item mx-2"
        v-for="(team, index) in teamList"
        :key="index"
      >
        <div
          class="team-item-card"
          :class="{ 'selected-team' : selectedTeams.indexOf(team) != -1 }"
          @click.stop="onClickTeam(team)"
        >
          <TeamCardC
            :team="team"
          />
          <button
            class="edit-team-button btn btn-primary"
            type="button"
            title="Edit team"
            @click.stop="openTeamEdit(team)"
            tabindex="-1"
          >
            <span class="visually-hidden">Edit team</span>
            <i class="pi pi-pencil mx-1"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="bottom-section my-3">
      <button
        class="btn btn-primary p-2" type="button"
        @click="openTeamAdd"
      >
        <i class="pi pi-plus"></i>
        <span class="ms-2">Team</span>
      </button>
      <button
        class="btn btn-primary p-2" type="button"
        @click="addMatch"
      >
        <i class="pi pi-plus"></i>
        <span class="ms-2">Match</span>
      </button>
      <TeamModalC
        :mode="teamModalMode"
        :teamId="teamModalId"
      />
    </div>
  </div>
</div>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 300px;
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

.team-item-card {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  margin-top: 2px;
}
.team-item-card:hover {
  cursor: pointer;
}
.selected-team {
  box-shadow: 0 0 0 2px var(--purple-primary);
}
:deep(.team-item-card img) {
  border-bottom-left-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
}

.edit-team-button {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 0;
  padding: 0;
  border-radius: 0;
}
.team-item-card:hover > .edit-team-button {
  width: 2.5rem;
}

.bottom-section {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  border-top: 1px solid var(--color-border-hover);
}
.bottom-section button {
  width: fit-content;
  height: fit-content;
  margin-top: 1.5rem;
}

@media (max-width: 800px) {
  .sidebar {
    width: 100%;
    height: 400px;
    border-bottom: 1px solid var(--color-border);
  }
  .sidebar h2 {
    display: none;
  }

  .team-list {
    align-items: center;
  }
  .team-item {
    height: fit-content;
    width: 280px;
    flex: 0 0 auto;
  }

  .team-item-card:hover > .edit-team-button {
    width: 3rem;
  }
}
</style>