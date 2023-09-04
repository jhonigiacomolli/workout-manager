import { TeamModel } from '@/protocols/models/team'
import { HTTPRequestParams } from '../models/http'

export type CreateTeamParams = Omit<TeamModel, 'id'>

export type UpdateTeamParams = Omit<TeamModel, 'id' | 'createdAt'>

export interface Team {
  create: (params: CreateTeamParams) => Promise<TeamModel>
  delete: (id: string) => Promise<boolean>
  getTeamByID: (id: string) => Promise<TeamModel | undefined>
  getAllTeams: (params?: HTTPRequestParams) => Promise<TeamModel[]>
  setTeamByID: (id: string, data: UpdateTeamParams) => Promise<TeamModel | undefined>
}
