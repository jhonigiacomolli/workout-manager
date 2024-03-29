import { makeFakeAccount } from './account-fakes'
import { Account } from '@/protocols/use-cases/account'
import { AccountModel } from '@/protocols/models/account'

export class AccountStub implements Account {
  async getUserById(): Promise<AccountModel | undefined> {
    return Promise.resolve(makeFakeAccount())
  }

  async getUserByEmail(): Promise<AccountModel | undefined> {
    return Promise.resolve(makeFakeAccount())
  }

  async create(): Promise<AccountModel> {
    return await Promise.resolve(makeFakeAccount())
  }

  async checkEmailInUse(): Promise<boolean> {
    return await Promise.resolve(false)
  }

  async setUserById(): Promise<AccountModel | undefined> {
    return await Promise.resolve(makeFakeAccount())
  }

  async delete(): Promise<boolean> {
    return await Promise.resolve(true)
  }

  async getAllAccounts(): Promise<AccountModel[]> {
    return await Promise.resolve([makeFakeAccount()])
  }
}
