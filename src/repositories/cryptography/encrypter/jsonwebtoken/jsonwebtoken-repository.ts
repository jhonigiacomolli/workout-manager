import { env } from 'process'
import { JwtPayload, sign, verify } from 'jsonwebtoken'
import { EncryptOptions, type Encrypter } from '@/protocols/use-cases/cryptography/encrypter'

type JWTEncryptOptions = {
  expiresIn: number
  issuer?: string
}
export class JsonwebtokenRepository implements Encrypter {
  async encrypt(id: string, options?: EncryptOptions): Promise<string> {
    const secret = env.JWT_SECURE_KEY
    const encriptOtions: JWTEncryptOptions = {
      expiresIn: 3600,
    }

    if (options?.expire) {
      encriptOtions.expiresIn = options.expire
    }
    if (options?.issuer) {
      encriptOtions.issuer = options.issuer
    }

    if (!secret) throw new Error('')

    const encrypted = sign({ data: { id } }, secret, encriptOtions)

    return await Promise.resolve(encrypted)
  }

  async decrypt(hash: string): Promise<any> {
    const secret = env.JWT_SECURE_KEY

    if (!secret) throw new Error('')

    const decrypted = verify(hash, secret) as JwtPayload

    return await Promise.resolve(decrypted.data)
  }
}
