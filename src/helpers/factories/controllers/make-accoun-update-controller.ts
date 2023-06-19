import { PgAccountRepository } from '@/repositories/acccount/postgres-account-repository'
import { BcryptRepository } from '@/repositories/cryptography/hasher/bcrypt/bcrypt-hasher-repository'
import { JsonwebtokenRepository } from '@/repositories/cryptography/encrypter/jsonwebtoken/jsonwebtoken-repository'
import { AccountUdateController } from '@/controllers/account/account-update/account-update-controller'

export const makeAccountUpdateController = () => {
  return new AccountUdateController({
    account: new PgAccountRepository(),
    hasher: new BcryptRepository(12),
    encrypter: new JsonwebtokenRepository(),
  })
}
