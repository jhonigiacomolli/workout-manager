import { PgAccountRepository } from '@/repositories/acccount/postgres-account-repository'
import { AccountUdateController } from '@/controllers/account/account-update/account-update-controller'
import { PgTeamRepository } from '@/repositories/team/postgres-team-repository'

export const makeAccountUpdateController = () => {
  return new AccountUdateController({
    account: new PgAccountRepository(),
    team: new PgTeamRepository(),
  })
}
