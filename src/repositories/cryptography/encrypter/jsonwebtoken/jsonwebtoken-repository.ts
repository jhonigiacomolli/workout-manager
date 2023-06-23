import { env } from 'process'
import { JwtPayload, sign, verify } from 'jsonwebtoken'
import { EncryptOptions, EncryptReturnStatus, type Encrypter } from '@/protocols/use-cases/cryptography/encrypter'

type JWTEncryptOptions = {
  expiresIn: number
  issuer?: string
}
export class JsonwebtokenRepository implements Encrypter {
  async encrypt(data: any, options?: EncryptOptions): Promise<string> {
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

    const encrypted = sign({ data }, secret, encriptOtions)

    return await Promise.resolve(encrypted)
  }

  async decrypt(hash: string, issuer: string): Promise<{ data: any, status: EncryptReturnStatus }> {
    const secret = env.JWT_SECURE_KEY

    if (!secret) {
      return Promise.resolve({
        data: undefined,
        status: {
          success: false,
          message: 'Internal Server Error',
        },
      })
    }

    try {
      const decrypted = verify(hash, secret, { issuer }) as JwtPayload
      return await Promise.resolve({
        data: decrypted.data,
        status: {
          success:
            true,
          message: '',
        },
      })
    } catch (err) {
      const message = err.message === 'jwt expired' ? 'Expired token' : 'Invalid token'

      return await Promise.resolve({
        data: undefined,
        status: {
          success: false,
          message,
        },
      })
    }
  }
}
