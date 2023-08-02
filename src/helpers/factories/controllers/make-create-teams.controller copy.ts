import { CreateTeamController } from '@/controllers/team/create-team/create-team'
import { PgTeamRepository } from '@/repositories/team/postgres-team-repository'

export const makeCreateTeamController = () => {
  return new CreateTeamController({
    team: new PgTeamRepository(),
  })
}
