<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import Topbar from '@/components/Topbar.vue';
import MainArea from '@/components/MainArea.vue'
import { computed, onMounted, ref, watch } from 'vue';
import { windowWidth } from '@/assets/global';
import { teamList, matchList } from '@/assets/global';

const timeoutId = ref<number | undefined>()
const saveStatus = computed(() => timeoutId.value ? "Saving..." : "Changes saved" )

onMounted(() => {
  // load theme from localStorage, or set default
  const theme = localStorage.getItem("theme")
  if (!theme) {
    localStorage.setItem("theme", "dark")
    location.reload()
  }

  window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth
  })

  // load teams and matches from localStorage
  const teams = localStorage.getItem("teams")
  if (teams)
    teamList.value = JSON.parse(teams)
  const matches = localStorage.getItem("matches")
  if (matches)
    matchList.value = JSON.parse(matches)

  // watch data to keep localStorage up to date
  watch([teamList, matchList], () => {
    clearTimeout(timeoutId.value)
    timeoutId.value = setTimeout(() => {
      localStorage.setItem("teams", JSON.stringify(teamList.value))
      localStorage.setItem("matches", JSON.stringify(matchList.value))
      // clear timeoutId
      timeoutId.value = undefined
    }, 1000)
  }, { deep: true })
})

</script>

<template>
<div id="container">
  <header>
    <Topbar
      :saveStatus="saveStatus"
    />
  </header>

  <main>
    <Sidebar />
    <MainArea />
  </main>
</div>
</template>

<style scoped>
#container {
  position: fixed;
  width: 100%;
  height: 100%;
  inset: 0;
  display: flex;
  flex-direction: column;
}

header {
  width: 100%;
}

main {
  display: flex;
  width: 100%;
  flex: 1;
  min-height: 0;
}

@media (max-width: 800px) {
  main {
    flex-direction: column;
  }
}
</style>
