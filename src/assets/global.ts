import { ref } from 'vue'

export type Team = {
  name: string,
  imageUrl: string,
  color: string
}

export type Match = {
  posX: number,
  posY: number,
  team1: {
    team: Team,
    score: number
  },
  team2: {
    team: Team,
    score: number
  }
}

export const teamList = ref<Team[]>([
  {
    name: "Liquid",
    imageUrl: "",
    color: "#13d4f1"
  },
  {
    name: "Fnatic",
    imageUrl: "",
    color: ""
  },
  {
    name: "NTMR",
    imageUrl: "",
    color: "bleh"
  },
  {
    name: "M80",
    imageUrl: "",
    color: ""
  }
])
export const matchList = ref<Match[]>([
  {
    posX: 100,
    posY: 100,
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
    posX: 100,
    posY: 250,
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
