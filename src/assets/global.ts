import { ref, watch } from 'vue'
import type { Team, TeamSource, Match, Line } from "@/assets/types"

//
/* global variables */
//

export const windowWidth = ref<number>(window.innerWidth)
export const ZOOM_SENS = 1.10
export const STICK_RANGE = 8 // threshold for snapping in px (screen)
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

  // only one team in match
  if (parent.team1.source.type === "none")
    return getTeamFromSource(parent.team2.source, visited)
  if (parent.team2.source.type === "none")
    return getTeamFromSource(parent.team1.source, visited)

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

// functions to see if winner or loser of a match has been sent to another match
export function isWinnerUsed(match: Match) {
  return matchList.value.some(m => {

    const source1 = m.team1.source
    if (source1.type === "match" && source1.bracket === "winner" && source1.matchId === match.id)
      return true

    const source2 = m.team2.source
    if (source2.type === "match" && source2.bracket === "winner" && source2.matchId === match.id)
      return true

    return false
  })
}
export function isLoserUsed(match: Match) {
  return matchList.value.some(m => {

    const source1 = m.team1.source
    if (source1.type === "match" && source1.bracket === "loser" && source1.matchId === match.id)
      return true

    const source2 = m.team2.source
    if (source2.type === "match" && source2.bracket === "loser" && source2.matchId === match.id)
      return true

    return false
  })
}

// gets all matches that a match gets its sources from
export function getSourceMatches(match: Match, sources: string[] = new Array<string>()) {
  // base case, both sources not from match
  if (match.team1.source.type !== "match" && match.team2.source.type !== "match")
    return

  // in case matches source already has been visited
  if (sources.some(s => s === match.id))
    return

  const source1 = match.team1.source
  const source2 = match.team2.source
  // add sources from team 1 source match
  if (source1.type === "match") {
    getSourceMatches(matchList.value[getMatchIndexById(source1.matchId)]!, sources)
    sources.push(source1.matchId)
  }

  // add sources from team 2 source match
  if (source2.type === "match") {
    getSourceMatches(matchList.value[getMatchIndexById(source2.matchId)]!, sources)
    sources.push(source2.matchId)
  }
}

export function trySetSourceMatch(from: Match, to: Match, bracket: "winner" | "loser") {
  // check if match has empty slot
  if (to.team1.source.type !== "none" && to.team2.source.type !== "none")
    return false

  // prevent self and circular reference
  let sources = new Array<string>()
  getSourceMatches(from, sources)
  if (from.id === to.id || sources.some(s => s === to.id))
    return false

  const source: TeamSource = {
    type: "match",
    matchId: from.id,
    bracket: bracket
  }

  if (to.team1.source.type === "none") {
    to.team1.source = source
    to.team1.score = 0
  }
  else if (to.team2.source.type === "none") {
    to.team2.source = source
    to.team2.score = 0
  }
  else
    return false // not possible but why not

  return true
}

export function trySetSourceTeam(from: Team, to: Match) {
  // check if match has empty slot
  if (to.team1.source.type !== "none" && to.team2.source.type !== "none")
    return false

  // cant assign if match already has team assigned
  if (
    (to.team1.source.type === "team" && to.team1.source.teamId === from.id) ||
    (to.team2.source.type === "team" && to.team2.source.teamId === from.id)
  )
    return false

  const source: TeamSource = {
    type: "team",
    teamId: from.id
  }

  if (to.team1.source.type === "none") {
    to.team1.source = source
    to.team1.score = 0
  }
  else if (to.team2.source.type === "none") {
    to.team2.source = source
    to.team2.score = 0
  }
  else
    return false // not possible but why not

  return true
}

export function createLinePath(start: { x: number, y: number }, end: { x: number, y: number }, verticalDirection: boolean, dashed: boolean, color: string, width: number) {
  const lines: Line[] = []

  // Case 1: Aligned on an axis

  if (Math.round((start.x - end.x) * 100) / 100 === 0 || Math.round((start.y - end.y) * 100) / 100 === 0) {
    lines.push({
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
      width,
      color,
      dashed
    })

    return lines
  }

  // Case 2: Not aligned

  const midStep = verticalDirection ? (end.y + start.y) / 2 : (end.x + start.x) / 2

  const mid1 = verticalDirection ? {
    x: start.x,
    y: midStep
  } : {
    x: midStep,
    y: start.y
  }
  const mid2 = verticalDirection ? {
    x: end.x,
    y: midStep
  } : {
    x: midStep,
    y: end.y
  }

  lines.push({
    x1: start.x,
    y1: start.y,
    x2: mid1.x,
    y2: mid1.y,
    width: width,
    color: color,
    dashed: dashed
  })
  lines.push({
    x1: mid1.x,
    y1: mid1.y,
    x2: mid2.x,
    y2: mid2.y,
    width: width,
    color: color,
    dashed: dashed
  })
  lines.push({
    x1: mid2.x,
    y1: mid2.y,
    x2: end.x,
    y2: end.y,
    width: width,
    color: color,
    dashed: dashed
  })

  return lines
}

//
/* data lists */
//

export const teamList = ref<Team[]>([])
export const matchList = ref<Match[]>([])

// Placeholder values below

// teamList.value = [
//   {
//     id: makeId("t"),
//     name: "Liquid",
//     imageUrl: ""
//   },
//   {
//     id: makeId("t"),
//     name: "Fnatic",
//     imageUrl: ""
//   },
//   {
//     id: makeId("t"),
//     name: "NTMR",
//     imageUrl: ""
//   },
//   {
//     id: makeId("t"),
//     name: "M80",
//     imageUrl: ""
//   }
// ]
// matchList.value = [
//   {
//     id: makeId("m"),
//     posX: 100,
//     posY: 100,
//     team1: {
//       source: { type: "team", teamId: teamList.value[0]!.id },
//       score: 1
//     },
//     team2: {
//       source: { type: "team", teamId: teamList.value[1]!.id },
//       score: 3
//     }
//   },
//   {
//     id: makeId("m"),
//     posX: 100,
//     posY: 250,
//     team1: {
//       source: { type: "team", teamId: teamList.value[2]!.id },
//       score: 3
//     },
//     team2: {
//       source: { type: "team", teamId: teamList.value[3]!.id },
//       score: 2
//     }
//   },
//   {
//     id: makeId("m"),
//     posX: 400,
//     posY: 500,
//     team1: {
//       source: { type: "team", teamId: teamList.value[3]!.id },
//       score: 0
//     },
//     team2: {
//       source: { type: "none" },
//       score: 0
//     }
//   }
// ]
// matchList.value.push ({
//   id: makeId("m"),
//   posX: 400,
//   posY: 150,
//   team1: {
//     source: { type: "match", matchId: matchList.value[0]!.id, bracket: "winner" },
//     score: 0
//   },
//   team2: {
//     source: { type: "match", matchId: matchList.value[1]!.id, bracket: "winner" },
//     score: 0
//   }
// })
