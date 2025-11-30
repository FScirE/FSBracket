<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getMatchIndexById, removeMatchById, matchList, getTeamFromSource, type Team } from '@/assets/global';
import { Modal } from 'bootstrap';
import DoubleButtonC from '@/components/other/DoubleButtonC.vue';
import TeamCardC from '@/components/cards/TeamCardC.vue';

const props = defineProps<{
  matchId: string
}>()

const matchModalElement = ref<HTMLElement | null>(null)

const match = computed(() => matchList.value[getMatchIndexById(props.matchId)])
const team1 = ref<Team | null>()
const team2 = ref<Team | null>()
const score1 = ref<number>(0)
const score2 = ref<number>(0)

const shown = ref<boolean>(false)

function editMatch() {
  if (match.value) {
    match.value.team1.score = score1.value
    match.value.team2.score = score2.value
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

watch(shown, () => {
  team1.value = match.value ? getTeamFromSource(match.value.team1.source) : null
  team2.value = match.value ? getTeamFromSource(match.value.team2.source) : null
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
            <div class="d-flex flex-column modal-body align-self-center w-75 my-2" v-if="match">
              <div class="team-info" >
                <TeamCardC
                  :team="team1!"
                  v-model:score="score1"
                  :key="match.team1.score"
                />
              </div>
              <h5 class="align-self-center my-2">vs</h5>
              <div class="team-info">
                <TeamCardC
                  :team="team2!"
                  v-model:score="score2"
                  :key="match.team2.score"
                />
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
</style>
