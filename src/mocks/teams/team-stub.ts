import { TeamModel } from '@/protocols/models/team'
import { Team } from '@/protocols/use-cases/team'
import { makeFakeTeam } from './make-fake-team'

export class TeamStub implements Team {
  async getTeamByID(): Promise<TeamModel | undefined> {
    return Promise.resolve(makeFakeTeam())
  }
}
