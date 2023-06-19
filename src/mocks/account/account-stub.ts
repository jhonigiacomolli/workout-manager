import { makeFakeAccount } from './make-fake-account'
import { Account } from '@/protocols/use-cases/account'
import { AccountModel } from '@/protocols/models/account'

export class AccountStub implements Account {
  async getUserByEmail(): Promise<AccountModel | undefined> {
    return Promise.resolve(makeFakeAccount())
  }

  async create(): Promise<boolean> {
    return await Promise.resolve(true)
  }

  async checkEmailInUse(): Promise<boolean> {
    return await Promise.resolve(true)
  }

  async setUserById(): Promise<boolean> {
    return await Promise.resolve(true)
  }
}
