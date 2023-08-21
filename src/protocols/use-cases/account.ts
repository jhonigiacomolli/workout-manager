import { HTTPRequestParams } from '../models/http'
import { type AccountModel } from '../models/account'

export type CreateAccountParams = Omit<AccountModel, 'id'>

export interface Account {
  create: (account: CreateAccountParams) => Promise<AccountModel>
  delete: (accountId: string) => Promise<boolean>
  checkEmailInUse: (email: string) => Promise<boolean>
  getUserById: (id: string) => Promise<AccountModel | undefined>
  getUserByEmail: (email: string) => Promise<AccountModel | undefined>
  getAllAccounts: (params?: HTTPRequestParams) => Promise<AccountModel[]>
  setUserById: (accountId: string, data: CreateAccountParams) => Promise<boolean>
}
