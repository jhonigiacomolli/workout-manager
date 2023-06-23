import { LoadTeamController } from '@/controllers/team/load-team/load-team'
import { PgTeamRepository } from '@/repositories/team/postgres-team-repository'

export const makeLoadTeamController = () => {
  return new LoadTeamController({
    team: new PgTeamRepository(),
  })
}
