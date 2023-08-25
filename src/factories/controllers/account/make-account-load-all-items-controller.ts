import { PgAccountRepository } from '@/repositories/acccount/postgres-account-repository'
import { AccountLoadAllItemsController } from '@/controllers/account/account-load-all-items/load-all-accounts'

export const makeAccountLoadAllItemsController = () => {
  return new AccountLoadAllItemsController({
    account: new PgAccountRepository(),
  })
}
