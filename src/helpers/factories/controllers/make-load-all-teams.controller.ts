import { LoadAllTeamsController } from '@/controllers/team/load-all-teams/load-all-teams'
import { PgTeamRepository } from '@/repositories/team/postgres-team-repository'

export const makeLoadAllTeamsController = () => {
  return new LoadAllTeamsController({
    team: new PgTeamRepository(),
  })
}
