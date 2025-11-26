<script setup lang="ts">
import { ref } from 'vue'
import { teamList, type Team } from '@/assets/global';

const name = ref("Example")
const imageUrl = ref("https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/768px-LEGO_logo.svg.png")
const color = ref("#ffee00")

function addTeam() {
  teamList.value.push({
    name: name.value,
    imageUrl: imageUrl.value,
    color: color.value
  })
}
</script>

<template>
  <teleport to="body">
    <div class="modal fade" id="team-modal" tabindex="-1" aria-labelledby="team-modal-label" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-3" id="team-modal-label">Add new team</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form @submit.prevent="addTeam">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input class="form-control" v-model="name" />
              </div>
              <div class="mb-3">
                <label class="form-label">Image URL</label>
                <input class="form-control" v-model="imageUrl" />
              </div>
              <div class="mb-3">
                <label class="form-label">Color</label>
                <input class="form-control form-control-color" type="color" v-model="color" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
