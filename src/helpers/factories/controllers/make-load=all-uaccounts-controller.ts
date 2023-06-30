import { PgAccountRepository } from '@/repositories/acccount/postgres-account-repository'
import { LoadAllAccountsController } from '@/controllers/account/load-all-accounts/load-all-accounts'

export const makeLoadAllAccountsController = () => {
  return new LoadAllAccountsController({
    account: new PgAccountRepository(),
  })
}
