import { TeamModel } from '@/protocols/models/team'
import { Team } from '@/protocols/use-cases/team'

export class TeamStub implements Team {
  async getTeamByID(): Promise<TeamModel | undefined> {
    return Promise.resolve({
      id: 'any_team_id',
      title: 'any_title',
      members: [],
    })
  }
}
