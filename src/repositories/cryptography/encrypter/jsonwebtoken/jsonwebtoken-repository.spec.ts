import jwt from 'jsonwebtoken'
import { JsonwebtokenRepository } from './jsonwebtoken-repository'

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(() => {
    return { id: 'decrypted_id' }
  }),
  sign: jest.fn(() => {
    return 'encrypted_hash'
  }),
}))

const makeSut = () => new JsonwebtokenRepository()

process.env.JWT_SECURE_KEY = 'secret-key'

describe('Json WebToken Repository', () => {
  describe('encrypt()', () => {
    test('Should Repository is called with correct value', async () => {
      const sut = makeSut()
      const jsonSpy = jest.spyOn(jwt, 'sign')
      const options = {
        expire: 3600,
        issuer: 'any_host',
      }
      const token = await sut.encrypt('any_id', options)
      expect(jsonSpy).toHaveBeenCalledWith({ data: 'any_id' }, 'secret-key', {
        expiresIn: options.expire,
        issuer: options.issuer,
      })
      expect(typeof token).toBe('string')
      expect(token).not.toBe('')

      const newToken = await sut.encrypt('any_id', { expire: 86400 })
      expect(jsonSpy).toHaveBeenCalledWith({ data: 'any_id' }, 'secret-key', { expiresIn: 86400, issuer: undefined })
      expect(typeof newToken).toBe('string')
      expect(newToken).not.toBe('')
    })
    test('Should Repository is called with correct value but options is not provided', async () => {
      const sut = makeSut()
      const jsonSpy = jest.spyOn(jwt, 'sign')
      const token = await sut.encrypt('any_id')
      expect(jsonSpy).toHaveBeenCalledWith({ data: 'any_id' }, 'secret-key', {
        expiresIn: 3600,
      })
      expect(typeof token).toBe('string')
      expect(token).not.toBe('')
    })

    test('Should Repository return 500 with secret is not set', async () => {
      const sut = makeSut()
      delete process.env.JWT_SECURE_KEY
      await expect(sut.encrypt('any_id')).rejects.toThrow('')
    })
  })
  describe('decrypt', () => {
    test('Should Repository is called with correct value', async () => {
      process.env.JWT_SECURE_KEY = 'secret-key'

      const sut = makeSut()
      const jsonSpy = jest.spyOn(jwt, 'verify')
      const token = await sut.decrypt('hashed_token', 'localhost')

      expect(jsonSpy).toHaveBeenCalledWith('hashed_token', 'secret-key', { issuer: 'localhost' })
      expect(token).not.toBe('')
    })

    test('Should Repository returns if a correct value if a expired token as provided', async () => {
      process.env.JWT_SECURE_KEY = 'secret-key'

      const sut = makeSut()
      const jsonSpy = jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error('jwt expired') })
      const token = await sut.decrypt('expirade_token', 'localhost')

      expect(jsonSpy).toHaveBeenCalledWith('expirade_token', 'secret-key', { issuer: 'localhost' })
      expect(token).toEqual({
        data: undefined,
        status: {
          success: false,
          message: 'Expired token',
        },
      })
    })

    test('Should Repository returns if a correct value if a invalid token as provided', async () => {
      process.env.JWT_SECURE_KEY = 'secret-key'

      const sut = makeSut()
      const jsonSpy = jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error('invalid secret') })
      const token = await sut.decrypt('expirade_token', 'localhost')

      expect(jsonSpy).toHaveBeenCalledWith('expirade_token', 'secret-key', { issuer: 'localhost' })
      expect(token).toEqual({
        data: undefined,
        status: {
          success: false,
          message: 'Invalid token',
        },
      })
    })

    test('Should Repository return a fails values of decrypt', async () => {
      const sut = makeSut()
      delete process.env.JWT_SECURE_KEY
      const result = await sut.decrypt('hashed_token', 'localhost')
      expect(result).toEqual({
        data: undefined,
        status: {
          success: false,
          message: 'Internal Server Error',
        },
      })
    })
  })
})
