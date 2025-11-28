import { ref } from 'vue'

//
/* global variables */
//

export const ZOOM_SENS = 1.10
export const STICK_RANGE = 12 // threshold for snapping in px (screen)
export const MATCH_GAP = 54 // default gap for matches in px (local), for snapping

//
/* helper functions */
//

let idCounter = 0
export function makeId(prefix: string) {
  idCounter++
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`
}

export function getTeamIndexById(id: string) {
  return teamList.value.findIndex(t => t.id === id)
}

export function getMatchIndexById(id: string) {
  return matchList.value.findIndex(m => m.id === id)
}

export function removeMatchById(id: string) {
  matchList.value.splice(getMatchIndexById(id), 1)
  // clear references in matches
  matchList.value.forEach(m => {
    if (m.team1.source.type === "match" && m.team1.source.matchId === id)
      m.team1.source = { type: "none" }
    if (m.team2.source.type === "match" && m.team2.source.matchId === id)
      m.team2.source = { type: "none" }
  })
}

export function removeTeamById(id: string) {
  teamList.value.splice(getTeamIndexById(id), 1)
  // clear references in matches
  matchList.value.forEach(m => {
    if (m.team1.source.type === "team" && m.team1.source.teamId === id)
      m.team1.source = { type: "none" }
    if (m.team2.source.type === "team" && m.team2.source.teamId === id)
      m.team2.source = { type: "none" }
  })
}

// recursively get team id from source
export function getTeamFromSource(source: TeamSource, visited: string[] = new Array<string>()) {
  if (!source)
    return null
  if (source.type === "none")
    return null
  if (source.type === "team")
    return teamList.value[getTeamIndexById(source.teamId)]

  // match source
  const parent = matchList.value[getMatchIndexById(source.matchId)]
  if (!parent)
    return null
  if (visited.includes(parent.id))
    return null
  visited.push(parent.id)

  const score1 = parent.team1.score
  const score2 = parent.team2.score
  if (score1 == null || score2 == null)
    return null
  if (score1 === score2)
    return null // tie / undecided

  const winner = score1 > score2 ? "team1" : "team2"
  const loser = winner === "team1" ? "team2" : "team1"
  const chosenSource = source.bracket === "winner" ? parent[winner].source : parent[loser].source

  return getTeamFromSource(chosenSource, visited)
}

//
/* data types */
//

export type Team = {
  id: string,
  name: string,
  imageUrl: string
}

export type TeamSource = {
  type: "team",
  teamId: string
} | {
  type: "match",
  matchId: string,
  bracket: "winner" | "loser"
} | {
  type: "none"
}

export type Match = {
  id: string,
  posX: number,
  posY: number,
  team1: {
    source: TeamSource,
    score: number
  },
  team2: {
    source: TeamSource,
    score: number
  }
}

//
/* data lists */
//

export const teamList = ref<Team[]>([
  {
    id: makeId("t"),
    name: "Liquid",
    imageUrl: ""
  },
  {
    id: makeId("t"),
    name: "Fnatic",
    imageUrl: ""
  },
  {
    id: makeId("t"),
    name: "NTMR",
    imageUrl: ""
  },
  {
    id: makeId("t"),
    name: "M80",
    imageUrl: ""
  }
])
export const matchList = ref<Match[]>([
  {
    id: makeId("m"),
    posX: 100,
    posY: 100,
    team1: {
      source: { type: "team", teamId: teamList.value[0]!.id },
      score: 1
    },
    team2: {
      source: { type: "team", teamId: teamList.value[1]!.id },
      score: 3
    }
  },
  {
    id: makeId("m"),
    posX: 100,
    posY: 250,
    team1: {
      source: { type: "team", teamId: teamList.value[2]!.id },
      score: 3
    },
    team2: {
      source: { type: "team", teamId: teamList.value[3]!.id },
      score: 2
    }
  },
  {
    id: makeId("m"),
    posX: 400,
    posY: 500,
    team1: {
      source: { type: "team", teamId: teamList.value[3]!.id },
      score: 0
    },
    team2: {
      source: { type: "none" },
      score: 0
    }
  }
])

matchList.value.push ({
  id: makeId("m"),
  posX: 400,
  posY: 150,
  team1: {
    source: { type: "match", matchId: matchList.value[0]!.id, bracket: "winner" },
    score: 0
  },
  team2: {
    source: { type: "match", matchId: matchList.value[1]!.id, bracket: "winner" },
    score: 0
  }
})
