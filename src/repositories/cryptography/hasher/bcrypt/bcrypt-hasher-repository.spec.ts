import { BcryptRepository } from './bcrypt-hasher-repository'
import bcrypt from 'bcrypt'

const makeSut = () => ({
  salt: 12,
  sut: new BcryptRepository(12),
})

describe('Bcrypt Repository', () => {
  describe('Hash', () => {
    test('Should Bcrypt Repository calls generate medthod with correct password', async () => {
      const { sut, salt } = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.generate('any_password')
      expect(hashSpy).toHaveBeenCalledWith('any_password', salt)
    })
    test('Should Bcrypt Repository return correct hash value', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => await Promise.resolve('hashed_password'))
      const hashResult = await sut.generate('any_password')
      expect(hashResult).toBe('hashed_password')
    })
    test('Should Bcrypt Repository throw if hash method throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => { await Promise.reject(new Error()) })
      const hashResult = sut.generate('any_password')
      return expect(hashResult).rejects.toThrow()
    })
  })
})
