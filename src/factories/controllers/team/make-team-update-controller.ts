import { TeamUpdateController } from '@/controllers/team/team-update/team-update-controller'
import { PgTeamRepository } from '@/repositories/team/postgres-team-repository'

export const makeTeamUpdateController = () => {
  return new TeamUpdateController({
    team: new PgTeamRepository(),
  })
}
