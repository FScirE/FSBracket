<script setup lang="ts">
import { downloadAsImage, exportToFile, importFromFile } from '@/assets/importexport'
import { ref, onMounted } from 'vue'

const shown = ref<boolean>(false)

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
</script>

<template>
  <teleport to="body">
    <div class="modal fade" id="ie-modal" tabindex="-1" aria-labelledby="ie-modal-label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-3" id="ie-modal-label">Import/export</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body align-self-center w-75">
            <div class="ie-buttons d-flex flex-column gap-3 mb-3 mt-2">

              <h4>Importing</h4>
              <span>
                <button class="btn btn-primary" @click="importFromFile"><i class="pi pi-file-import"></i></button>
                Import from file
              </span>

              <hr class="hr text-secondary">
              <h4>Exporting</h4>
              <span>
                <button class="btn btn-primary" @click="downloadAsImage"><i class="pi pi-image"></i></button>
                Save as image
              </span>
              <span>
                <button class="btn btn-primary" @click="exportToFile"><i class="pi pi-file-export"></i></button>
                Export to file
              </span>

            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.ie-buttons button {
  margin-right: 0.5rem;
  font-size: 1.5rem;
}
</style>