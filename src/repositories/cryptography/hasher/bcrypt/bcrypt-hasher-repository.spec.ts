import { BcryptRepository } from './bcrypt-hasher-repository'
import bcrypt from 'bcrypt'

const makeSut = () => ({
  salt: 12,
  sut: new BcryptRepository(12),
})

describe('Bcrypt Repository', () => {
  describe('generate()', () => {
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
  describe('compare()', () => {
    test('Should Bcrypt Repository calls compare medthod with correct password', async () => {
      const { sut } = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_password', 'hashed_password')
      expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
    })
    test('Should Bcrypt Repository return true if password and hash to be equal', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.resolve(true))
      const hashResult = await sut.compare('any_password', 'hashed_password')
      expect(hashResult).toBeTruthy()
    })
    test('Should Bcrypt Repository return false if password and hash not to be equal', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.resolve(false))
      const hashResult = await sut.compare('any_password', 'hashed_password')
      expect(hashResult).toBeFalsy()
    })
    test('Should Bcrypt Repository throw if compare method throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => { await Promise.reject(new Error()) })
      const hashResult = sut.compare('any_password', 'hashed_password')
      return expect(hashResult).rejects.toThrow()
    })
  })
})
