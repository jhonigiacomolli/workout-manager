import { hash } from "bcrypt";

export class BcryptRepository {
  constructor(private readonly salt: number) { }
  // encrypt(email: string, passoword: string): Promise<string> {

  //   return Promise.resolve('')
  // }
  async hash(password: string): Promise<string> {
    const hashResult = await hash(password, this.salt)
    return hashResult
  }
}
