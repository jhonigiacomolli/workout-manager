import { AccountModel } from "../models/account";

export type CreateAccountParams = Omit<AccountModel, 'id'> & {
  accessToken: string
}

export interface Account {
  create(account: CreateAccountParams): Promise<{ accessToken: string }>
  checkEmailInUse(email: string): Promise<boolean>
}
