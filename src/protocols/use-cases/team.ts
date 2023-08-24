import { TeamModel } from '@/protocols/models/team'
import { HTTPRequestParams } from '../models/http'

export type CreateTeamParams = Omit<TeamModel, 'id'>

export interface Team {
  getTeamByID: (id: string) => Promise<TeamModel | undefined>
  getAllTeams: (params?: HTTPRequestParams) => Promise<TeamModel[]>
  create: (params: CreateTeamParams) => Promise<TeamModel>
  delete: (id: string) => Promise<boolean>
}
