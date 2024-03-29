import { SignUpController } from '@/controllers/account/sing-up/sign-up-controller'
import { PgAccountRepository } from '@/repositories/acccount/postgres-account-repository'
import { BcryptRepository } from '@/repositories/cryptography/hasher/bcrypt/bcrypt-hasher-repository'
import { EmailValidatorRepository } from '@/repositories/email-validator/email-validator-repository'
import { LocalFileManagerRepository } from '@/repositories/file-manager/local-file-manager'

export const makeSignUpController = () => {
  return new SignUpController({
    account: new PgAccountRepository(),
    emailValidator: new EmailValidatorRepository(),
    hasher: new BcryptRepository(12),
    fileManager: new LocalFileManagerRepository(),
  })
}
