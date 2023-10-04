import { TeamRemoveController } from '@/controllers/team/team-remove/team-remove-controller'
import { PgTeamRepository } from '@/repositories/team/postgres-team-repository'

export const makeTeamRemoveController = () => {
  return new TeamRemoveController({
    team: new PgTeamRepository(),
  })
}
