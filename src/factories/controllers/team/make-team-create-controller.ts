import { TeamCreateController } from '@/controllers/team/team-create/team-create'
import { PgTeamRepository } from '@/repositories/team/postgres-team-repository'

export const makeTeamCreateController = () => {
  return new TeamCreateController({
    team: new PgTeamRepository(),
  })
}
