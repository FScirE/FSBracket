import { ref } from 'vue'

export type Team = {
  name: string,
  imageUrl: string
}

export type Match = {
  team1: {
    team: Team,
    score: number
  }
  team2: {
    team: Team,
    score: number
  }
}

export const teamList = ref<Team[]>([])
export const matchList = ref<Match[]>([
  {
    team1: {
      team: {
        name: "Liquid",
        imageUrl: ""
      },
      score: 1
    },
    team2: {
      team: {
        name: "Fnatic",
        imageUrl: ""
      },
      score: 3
    }
  },
  {
    team1: {
      team: {
        name: "NTMR",
        imageUrl: ""
      },
      score: 3
    },
    team2: {
      team: {
        name: "M80",
        imageUrl: ""
      },
      score: 2
    }
  }
])
