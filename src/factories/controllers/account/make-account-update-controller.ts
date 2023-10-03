import { PgTeamRepository } from '@/repositories/team/postgres-team-repository'
import { PgAccountRepository } from '@/repositories/acccount/postgres-account-repository'
import { LocalFileManagerRepository } from '@/repositories/file-manager/local-file-manager'
import { AccountUdateController } from '@/controllers/account/account-update/account-update-controller'

export const makeAccountUpdateController = () => {
  return new AccountUdateController({
    account: new PgAccountRepository(),
    team: new PgTeamRepository(),
    fileManager: new LocalFileManagerRepository(),
  })
}
