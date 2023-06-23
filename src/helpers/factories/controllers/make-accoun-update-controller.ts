import { PgAccountRepository } from '@/repositories/acccount/postgres-account-repository'
import { AccountUdateController } from '@/controllers/account/account-update/account-update-controller'

export const makeAccountUpdateController = () => {
  return new AccountUdateController({
    account: new PgAccountRepository(),
  })
}
