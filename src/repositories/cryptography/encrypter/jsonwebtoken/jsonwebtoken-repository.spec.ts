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
      const token = await sut.encrypt('any_id')
      expect(jsonSpy).toHaveBeenCalledWith('any_id', 'secret-key')
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
      const token = await sut.decrypt('hashed_token')

      expect(jsonSpy).toHaveBeenCalledWith('hashed_token', 'secret-key')
      expect(token).not.toBe('')
    })

    test('Should Repository throws id secret is not set', async () => {
      const sut = makeSut()
      delete process.env.JWT_SECURE_KEY
      await expect(sut.decrypt('hashed_token')).rejects.toThrow('')
    })
  })
})
