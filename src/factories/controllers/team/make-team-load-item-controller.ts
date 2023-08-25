import { TeamLoadItemController } from '@/controllers/team/team-load-item/team-load-item'
import { PgTeamRepository } from '@/repositories/team/postgres-team-repository'

export const makeTeamLoadItemController = () => {
  return new TeamLoadItemController({
    team: new PgTeamRepository(),
  })
}
