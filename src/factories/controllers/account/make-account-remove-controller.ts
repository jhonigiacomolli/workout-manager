import { PgAccountRepository } from '@/repositories/acccount/postgres-account-repository'
import { AccountRemoveController } from '@/controllers/account/account-remove/account-remove-controller'

export const makeAccountRemoveController = () => {
  return new AccountRemoveController({
    account: new PgAccountRepository(),
  })
}
