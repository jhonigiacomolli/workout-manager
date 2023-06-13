import { compare, hash } from 'bcrypt'
import { type Hasher } from '@/protocols/use-cases/cryptography/hashser'

export class BcryptRepository implements Hasher {
  constructor(private readonly salt: number) { }

  async generate(password: string): Promise<string> {
    const hashResult = await hash(password, this.salt)
    return hashResult
  }

  async compare(password: string, hash: string): Promise<boolean> {
    const compareResult = await compare(password, hash)
    return compareResult
  }
}
