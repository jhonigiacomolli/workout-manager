import { Hasher } from '@/protocols/use-cases/cryptography/hashser'

export class HasherStub implements Hasher {
  async compare(): Promise<boolean> {
    return Promise.resolve(true)
  }

  async generate(): Promise<string> {
    return await Promise.resolve('hashed_password')
  }
}
