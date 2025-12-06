<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import Topbar from '@/components/Topbar.vue';
import MainArea from '@/components/MainArea.vue'
import { computed, onMounted, ref, watch } from 'vue';
import { trySetSourceTeam, windowWidth } from '@/assets/global';
import { teamList, matchList, trySetSourceMatch } from '@/assets/global';
import type { Match, Team } from '@/assets/types'

const timeoutId = ref<number | undefined>()
const saveStatus = computed(() => timeoutId.value ? "Saving..." : "Changes saved" )

const sendFromMatch = ref<Match | null>(null)
const sendFromTeam = ref<Team | null>(null)
const sendTo = ref<Match | null>(null)
const sendingType = ref<"match" | "team" | null>(null)
const sendBracket = ref<"winner" | "loser">("winner")

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

//------------------------

// enables "sending" mode, and sets which match has its result sent from
function startSendMatch(which: "winner" | "loser", match: Match) {
  if (sendingType.value)
    return
  sendingType.value = "match"
  sendBracket.value = which
  sendFromMatch.value = match
  sendTo.value = null
}
function startSendTeam(team: Team) {
  if (sendingType.value)
    return
  sendingType.value = "team"
  sendFromTeam.value = team
  sendTo.value = null
}

// disabled "sending" mode, and adds the match sent from as a source to the match sent to
function finishSend(match: Match | null) {
  sendTo.value = match

  if (!sendTo.value)
    sendingType.value = null
  else if (sendingType.value === "match") {
    if (!sendFromMatch.value)
      sendingType.value = null
    else {
      const result = trySetSourceMatch(sendFromMatch.value, sendTo.value, sendBracket.value)
      if (result) // keep selection active if not successful
        sendingType.value = null
    }
  }
  else {
    if (!sendFromTeam.value)
      sendingType.value = null
    else {
      const result = trySetSourceTeam(sendFromTeam.value, sendTo.value)
      if (result) // keep selection active if not successful
        sendingType.value = null
    }
  }
}

// Cancel "sending" mode with escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape")
    finishSend(null)
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
    <div
      class="sending-status"
      :class="{ 'is-sending' : sendingType !== null }"
    >
      <span class="fs-5 ps-3 me-3">Send {{ sendingType === "match" ? sendBracket : 'team' }} to match</span>
      <button class="btn btn-primary px-3" @click="finishSend(null)">
        <span>Cancel</span>
      </button>
    </div>
    <Sidebar
      :sending="sendingType !== null"
      @send:start="startSendTeam"
    />
    <MainArea
      :sending="sendingType !== null"
      @send:start="(value) => startSendMatch(value.which, value.match)"
      @send:finish="finishSend"
    />
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

.sending-status {
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  width: fit-content;
  height: 0;
  margin-top: 2px;
  background-color: var(--color-border-hover);
  border-radius: 0.5rem;
  transition: height 0.3s ease;
}
.sending-status button {
  height: 100%;
}
.sending-status.is-sending {
  height: 2.5rem;
  z-index: 12;
}

@media (max-width: 800px) {
  main {
    flex-direction: column;
  }
}
</style>
