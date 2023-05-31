import { AccountModel } from "../models/account";

export type UpdateAccountModel = AccountModel & {
  accessToken: string
}

export type CreateAccountParams = Omit<AccountModel, 'id'>

export interface Account {
  create(account: CreateAccountParams): Promise<{ id: string }>
  update(account: UpdateAccountModel): Promise<{ id: string }>
  checkEmailInUse(email: string): Promise<boolean>
}
