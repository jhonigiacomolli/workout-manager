import { TeamModel } from '@/protocols/models/team'

export const makeFakeTeam = (): TeamModel => ({
  id: 'valid_team_id',
  name: 'any_name',
  members: [],
})

export const makeFakeTeamList = (): TeamModel[] => [
  {
    id: 'valid_team_id',
    name: 'any_name',
    members: [],
  },
  {
    id: 'valid_team_id2',
    name: 'any_name2',
    members: [],
  },
  {
    id: 'valid_team_id3',
    name: 'any_name3',
    members: [],
  },
  {
    id: 'valid_team_id4',
    name: 'any_name4',
    members: [],
  },
  {
    id: 'valid_team_id5',
    name: 'any_name5',
    members: [],
  },
  {
    id: 'valid_team_id6',
    name: 'any_name6',
    members: [],
  },
]
