import { type AccountModel } from '../models/account'

export type CreateAccountParams = Omit<AccountModel, 'id'>

export interface Account {
  create: (account: CreateAccountParams) => Promise<boolean>
  delete: (accountId: string) => Promise<boolean>
  checkEmailInUse: (email: string) => Promise<boolean>
  getUserByEmail: (email: string) => Promise<AccountModel | undefined>
  setUserById: (account: AccountModel) => Promise<boolean>
}
