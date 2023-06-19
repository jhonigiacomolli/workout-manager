import { env } from 'process'
import { sign, verify } from 'jsonwebtoken'
import { type Encrypter } from '@/protocols/use-cases/cryptography/encrypter'

export class JsonwebtokenRepository implements Encrypter {
  async encrypt(id: string): Promise<string> {
    const secret = env.JWT_SECURE_KEY

    if (!secret) throw new Error('')

    const encrypted = sign(id, secret)

    return await Promise.resolve(encrypted)
  }

  async decrypt(hash: string): Promise<{ id: string }> {
    const secret = env.JWT_SECURE_KEY

    if (!secret) throw new Error('')

    const decrypted = verify(hash, secret) as string

    return await Promise.resolve({ id: decrypted })
  }
}
