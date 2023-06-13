import { hash } from 'bcrypt'
import { type Hasher } from '@/protocols/use-cases/cryptography/hashser'

export class BcryptRepository implements Hasher {
  constructor (private readonly salt: number) { }

  async generate (password: string): Promise<string> {
    const hashResult = await hash(password, this.salt)
    return hashResult
  }
}
