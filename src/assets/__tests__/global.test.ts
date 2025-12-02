import { teamList, matchList, trySetSourceMatch } from "@/assets/global"
import type { Team, Match } from "@/assets/types"
import { beforeEach, describe, expect, it } from "vitest"

const mockTeamList: Team[] = [
  {
    id: "t1",
    name: "team1",
    imageUrl: ""
  },
  {
    id: "t2",
    name: "team2",
    imageUrl: ""
  }
]

const mockMatchList: Match[] = [
  /* three "inline referenced" matches */
  {
    id: "m1",
    posX: 0,
    posY: 0,
    team1: {
      source: { type: "team", teamId: "t1" },
      score: 0
    },
    team2: {
      source: { type: "none" },
      score: 1
    }
  },
  {
    id: "m2",
    posX: 0,
    posY: 0,
    team1: {
      source: { type: "team", teamId: "t1" },
      score: 0
    },
    team2: {
      source: { type: "match", matchId: "m1", bracket: "winner" },
      score: 0
    }
  },
  {
    id: "m3",
    posX: 0,
    posY: 0,
    team1: {
      source: { type: "team", teamId: "t2" },
      score: 0
    },
    team2: {
      source: { type: "match", matchId: "m2", bracket: "loser" },
      score: 0
    }
  },
  /* one standalone match */
  {
    id: "m4",
    posX: 0,
    posY: 0,
    team1: {
      source: { type: "none" },
      score: 0
    },
    team2: {
      source: { type: "none" },
      score: 0
    }
  }
]

describe("global.ts: trySetSourceMatch", () => {

  beforeEach(() => {
    teamList.value = mockTeamList
    matchList.value = mockMatchList
  })

  it("returns true if source can be set", async () => {
    const result = trySetSourceMatch(matchList.value[2]!, matchList.value[3]!, "winner")
    expect(result).toBe(true)
  })

  it("returns false if no empty slots in match being sent to", async () => {
    const result = trySetSourceMatch(matchList.value[3]!, matchList.value[1]!, "winner")
    expect(result).toBe(false)
  })

  it("returns false if assigning to self", async () => {
    const result = trySetSourceMatch(matchList.value[2]!, matchList.value[2]!, "winner")
    expect(result).toBe(false)
  })

  it("returns false if it would lead to circular reference", async () => {
    const result = trySetSourceMatch(matchList.value[2]!, matchList.value[0]!, "loser")
    expect(result).toBe(false)
  })

})