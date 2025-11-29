<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getTeamIndexById, makeId, removeTeamById, teamList } from '@/assets/global';
import { Modal } from 'bootstrap';
import DoubleButtonC from '@/components/other/DoubleButtonC.vue';

const props = defineProps<{
  mode: "add"
} | {
  mode: "edit",
  teamId?: string
}>()

const modalElement = ref<HTMLElement | null>(null)

const team =  computed(() => {
  if (props.mode === "add" || !props.teamId)
    return null
  return teamList.value[getTeamIndexById(props.teamId)]
})
const name = ref<string>("")
const imageUrl = ref<string>("")

const shown = ref<boolean>(false)

function onSubmit() {
  if (props.mode === "add")
    addTeam()
  else
    editTeam()
}

function addTeam() {
  teamList.value.push({
    id: makeId("t"),
    name: name.value,
    imageUrl: imageUrl.value
  })
}
function editTeam() {
  if (team.value) {
    team.value.name = name.value
    team.value.imageUrl = imageUrl.value
  }
}
function removeTeam() {
  if (!modalElement.value)
    return
  const modal = Modal.getInstance(modalElement.value)
  if (!team.value)
    return
  removeTeamById(team.value.id)
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
  name.value = team.value ? team.value.name : "Example"
  imageUrl.value = team.value ? team.value.imageUrl : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/768px-LEGO_logo.svg.png"
})
</script>

<template>
  <teleport to="body">
    <div class="modal fade" id="team-modal" tabindex="-1" aria-labelledby="team-modal-label" aria-hidden="true" ref="modalElement">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-3" id="team-modal-label">
              {{ mode === 'add' ? 'Add new team' : `Edit team: ${team?.name}` }}
            </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="d-flex flex-column" id="team-form" @submit.prevent="onSubmit">
            <div class="modal-body align-self-center w-75">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input class="form-control" v-model="name" maxlength="32" />
              </div>
              <div class="mb-3">
                <label class="form-label">Image URL</label>
                <input class="form-control" v-model="imageUrl" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <DoubleButtonC
                v-if="mode === 'edit'"
                text1="Remove"
                text2="Remove"
                type="right"
                :callback="removeTeam"
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

</style>
