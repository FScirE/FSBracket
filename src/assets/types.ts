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
