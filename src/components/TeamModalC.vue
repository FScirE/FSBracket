<script setup lang="ts">
import { teamList } from '@/assets/global';
</script>

<template>
  <teleport to="body">
    <div class="modal fade" id="team-modal" aria-labelledby="team-modal-label" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-3" id="team-modal-label">Add new team</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>

</style>
