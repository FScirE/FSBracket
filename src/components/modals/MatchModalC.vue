<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getMatchIndexById, removeMatchById, matchList, getTeamFromSource } from '@/assets/global';
import type { Team } from "@/assets/types"
import { Modal } from 'bootstrap';
import DoubleButtonC from '@/components/other/DoubleButtonC.vue';
import TeamCardC from '@/components/cards/TeamCardC.vue';

const props = defineProps<{
  matchId: string
}>()

const matchModalElement = ref<HTMLElement | null>(null)

const match = computed(() => matchList.value[getMatchIndexById(props.matchId)])
const team1 = ref<Team | null>(null)
const team2 = ref<Team | null>(null)
const score1 = ref<number>(0)
const score2 = ref<number>(0)

const shown = ref<boolean>(false)

function editMatch() {
  if (match.value) {
    // update team 1
    match.value.team1.score = score1.value
    match.value.team1.source = team1.value ? match.value.team1.source : { type: "none" }
    // update team 2
    match.value.team2.score = score2.value
    match.value.team2.source = team2.value ? match.value.team2.source : { type: "none" }
  }
}
function removeMatch() {
  if (!matchModalElement.value)
    return
  const modal = Modal.getInstance(matchModalElement.value)
  if (!match.value)
    return
  removeMatchById(match.value.id)
  modal!.hide()
}
function removeSource(team: "team1" | "team2") {
  if (!match.value || match.value[team].source.type === "none")
    return
  if (team === "team1") {
    team1.value = null
    score1.value = 0
  }
  else {
    team2.value = null
    score2.value = 0
  }
}

onMounted(() => {
  document.addEventListener('show.bs.modal', () => {
    shown.value = true
  })
  document.addEventListener('hide.bs.modal', () => {
    if (document.activeElement)
      (document.activeElement as HTMLElement).blur();
  })
  document.addEventListener('hidden.bs.modal', () => {
    shown.value = false
  })
})

// update values so that they are correct when modal is shown
watch(shown, () => {
  team1.value = match.value ? getTeamFromSource(match.value.team1.source)! : null
  team2.value = match.value ? getTeamFromSource(match.value.team2.source)! : null
  score1.value = match.value ? match.value.team1.score : 0
  score2.value = match.value ? match.value.team2.score : 0
})
</script>

<template>
  <teleport to="body">
    <div class="modal fade" id="match-modal" tabindex="-1" aria-labelledby="match-modal-label" aria-hidden="true" ref="matchModalElement">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-3" id="match-modal-label">
              Edit match
            </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="d-flex flex-column" id="match-form" @submit.prevent="editMatch">
            <div class="d-flex flex-column modal-body align-self-center w-75 my-2">
              <!-- source 1 type label -->
              <h5 class="fw-normal">Source: <b>
                {{ team1 ? (match?.team1.source.type[0]?.charAt(0).toUpperCase() ?? "-") + match?.team1.source.type.slice(1) : 'None' }}
                {{ match?.team1.source.type === "match" ? match?.team1.source.bracket : '' }}
              </b></h5>
              <!-- team 1 card -->
              <div class="team-info popin-holder" >
                <TeamCardC
                  :team="team1!"
                  :sourceType="match?.team1.source.type"
                  v-model:score="score1"
                />
                <button type="button" tabindex="-1" class="btn btn-danger popin popin-left" @click="removeSource('team1')">
                  <i class="pi pi-times"></i>
                </button>
              </div>
              <!-- separator -->
              <h5 class="align-self-center my-2">vs</h5>
              <!-- source 2 type label -->
              <h5 class="fw-normal">Source: <b>
                {{ team2 ? (match?.team2.source.type[0]?.charAt(0).toUpperCase() ?? "-") + match?.team2.source.type.slice(1) : 'None' }}
                {{ match?.team2.source.type === "match" ? match?.team2.source.bracket : '' }}
              </b></h5>
              <!-- team 2 card -->
              <div class="team-info popin-holder">
                <TeamCardC
                  :team="team2!"
                  :sourceType="match?.team2.source.type"
                  v-model:score="score2"
                />
                <button type="button" tabindex="-1" class="btn btn-danger popin popin-left" @click="removeSource('team2')">
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <DoubleButtonC
                text1="Remove"
                text2="Remove"
                type="right"
                :callback="removeMatch"
              />
              <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Confirm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.team-info {
  border-radius: 0.5rem;
  overflow: hidden;
}
:deep(.team-info img) {
  border-bottom-left-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
}
</style>
