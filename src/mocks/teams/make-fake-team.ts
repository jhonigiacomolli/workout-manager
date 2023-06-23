import { TeamModel } from '@/protocols/models/team'

export const makeFakeTeam = (): TeamModel => ({
  id: 'valid_id',
  title: 'valid_name',
  members: [],
})
