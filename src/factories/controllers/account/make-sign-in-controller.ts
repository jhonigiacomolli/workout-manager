import { SignInController } from '@/controllers/account/sing-in/sign-in-controller'
import { PgAccountRepository } from '@/repositories/acccount/postgres-account-repository'
import { BcryptRepository } from '@/repositories/cryptography/hasher/bcrypt/bcrypt-hasher-repository'
import { JsonwebtokenRepository } from '@/repositories/cryptography/encrypter/jsonwebtoken/jsonwebtoken-repository'

export const makeSignInController = () => {
  return new SignInController({
    account: new PgAccountRepository(),
    hasher: new BcryptRepository(12),
    encrypter: new JsonwebtokenRepository(),
  })
}
