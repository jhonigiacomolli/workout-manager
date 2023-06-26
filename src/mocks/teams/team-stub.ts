import { makeFakeTeam, makeFakeTeamList } from './make-fake-team'
import { Team } from '@/protocols/use-cases/team'
import { TeamModel } from '@/protocols/models/team'

export class TeamStub implements Team {
  async getTeamByID(): Promise<TeamModel | undefined> {
    return Promise.resolve(makeFakeTeam())
  }

  async getAllTeams(): Promise<TeamModel[]> {
    return Promise.resolve(makeFakeTeamList())
  }
}
