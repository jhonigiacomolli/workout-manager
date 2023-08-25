import { TeamLoadAllItemsController } from '@/controllers/team/team-load-all-items/team-load-all-items'
import { PgTeamRepository } from '@/repositories/team/postgres-team-repository'

export const makeTeamLoadAllItemsController = () => {
  return new TeamLoadAllItemsController({
    team: new PgTeamRepository(),
  })
}
