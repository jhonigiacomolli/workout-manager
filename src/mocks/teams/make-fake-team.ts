import { TeamModel } from '@/protocols/models/team'

export const makeFakeTeam = (): TeamModel => ({
  id: 'valid_team_id',
  title: 'any_title',
  members: [],
})
