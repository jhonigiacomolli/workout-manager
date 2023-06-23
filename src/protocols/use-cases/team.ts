import { TeamModel } from '@/protocols/models/team'

export type CreateTeamParams = Omit<TeamModel, 'id'>

export interface Team {
  getTeamByID: (id: string) => Promise<TeamModel | undefined>
}
