import { Team } from '@/protocols/use-cases/team'
import { TeamModel } from '@/protocols/models/team'
import { makeFakeTeam, makeFakeTeamList } from './team-fakes'

export class TeamStub implements Team {
  async getTeamByID(): Promise<TeamModel | undefined> {
    return Promise.resolve(makeFakeTeam())
  }

  async getAllTeams(): Promise<TeamModel[]> {
    return Promise.resolve(makeFakeTeamList())
  }

  async create(): Promise<TeamModel> {
    return Promise.resolve(makeFakeTeam())
  }

  async delete(): Promise<boolean> {
    return Promise.resolve(true)
  }

  async setTeamByID(): Promise<TeamModel | undefined> {
    return Promise.resolve(makeFakeTeam())
  }
}
