import { TeamModel } from '@/protocols/models/team'

export const makeFakeTeam = (): TeamModel => ({
  id: 'valid_team_id',
  name: 'any_name',
  createdAt: '2023-06-30T03:00:00.000Z',
  members: [],
})

export const makeFakeTeamList = (): TeamModel[] => [
  {
    id: 'valid_team_id',
    name: 'any_name',
    createdAt: '2023-06-30T03:00:00.000Z',
    members: [],
  },
  {
    id: 'valid_team_id2',
    name: 'any_name2',
    createdAt: '2023-06-30T03:00:00.000Z',
    members: [],
  },
  {
    id: 'valid_team_id3',
    name: 'any_name3',
    createdAt: '2023-06-30T03:00:00.000Z',
    members: [],
  },
  {
    id: 'valid_team_id4',
    name: 'any_name4',
    createdAt: '2023-06-30T03:00:00.000Z',
    members: [],
  },
  {
    id: 'valid_team_id5',
    name: 'any_name5',
    createdAt: '2023-06-30T03:00:00.000Z',
    members: [],
  },
  {
    id: 'valid_team_id6',
    name: 'any_name6',
    createdAt: '2023-06-30T03:00:00.000Z',
    members: [],
  },
]
