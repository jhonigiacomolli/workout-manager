import { env } from 'process'
import { sign } from 'jsonwebtoken'
import { type Encrypter } from '@/protocols/use-cases/cryptography/encrypter'

export class JsonwebtokenRepository implements Encrypter {
  async encrypt (id: string): Promise<string> {
    const secret = env.JWT_SECURE_KEY

    if (!secret) throw new Error('')

    const encrypted = sign(id, secret)

    return await Promise.resolve(encrypted)
  }
}
