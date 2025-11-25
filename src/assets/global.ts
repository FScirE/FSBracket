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

export const teamList = ref<Team[]>([
  {
    name: "Liquid",
    imageUrl: ""
  },
  {
    name: "Fnatic",
    imageUrl: ""
  },
  {
    name: "NTMR",
    imageUrl: ""
  },
  {
    name: "M80",
    imageUrl: ""
  }
])
export const matchList = ref<Match[]>([
  {
    team1: {
      team: teamList.value[0]!,
      score: 1
    },
    team2: {
      team: teamList.value[1]!,
      score: 3
    }
  },
  {
    team1: {
      team: teamList.value[2]!,
      score: 3
    },
    team2: {
      team: teamList.value[3]!,
      score: 2
    }
  }
])
