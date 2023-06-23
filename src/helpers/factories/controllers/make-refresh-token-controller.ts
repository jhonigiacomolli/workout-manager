import { JsonwebtokenRepository } from '@/repositories/cryptography/encrypter/jsonwebtoken/jsonwebtoken-repository'
import { RefreshTokenController } from '@/controllers/account/refresh-token/refresh-token'

export const makeRefreshTokenController = () => {
  return new RefreshTokenController({
    encrypter: new JsonwebtokenRepository(),
  })
}
