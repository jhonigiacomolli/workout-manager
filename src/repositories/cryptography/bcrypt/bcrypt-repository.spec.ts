import { BcryptRepository } from "./bcrypt-repository"
import bcrypt from 'bcrypt'

const makeSut = () => ({
  salt: 12,
  sut: new BcryptRepository(12)
})

describe('Bcrypt Repository', () => {
  describe('Hash', () => {
    test('Should Bcrypt Repository calls hash medthod with correct values', async () => {
      const { sut, salt } = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_password')
      expect(hashSpy).toHaveBeenCalledWith('any_password', salt)
    })
    test('Should Bcrypt Repository return correct hash value', async () => {
      const { sut, salt } = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.resolve('hashed_password'))
      const hashResult = await sut.hash('any_password')
      expect(hashResult).toBe('hashed_password')
    })
  })
})
