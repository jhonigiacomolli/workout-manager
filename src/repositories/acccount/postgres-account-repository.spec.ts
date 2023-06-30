import { client } from '@/database'
import { PgAccountRepository } from './postgres-account-repository'
import { makeFakeAccount } from '@/mocks/account/make-fake-account'

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: () => ({
      rows: [],
      rowCount: 1,
    }),
    end: jest.fn(),
  }
  return { Client: jest.fn(() => mClient) }
})

const makeSut = () => {
  const sut = new PgAccountRepository()
  const params = makeFakeAccount()

  return {
    sut, params,
  }
}

describe('Postgres Account Repository', () => {
  describe('checkEmailInUse()', () => {
    test('Should return true when email already registered on database', async () => {
      const { sut, params } = makeSut()
      const result = await sut.checkEmailInUse(params.email)
      expect(result).toBeTruthy()

      jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rowCount: 2 }))

      const newResult = await sut.checkEmailInUse(params.email)
      expect(newResult).toBeTruthy()
    })
    test('Should return false when email already registered on database', async () => {
      const { sut, params } = makeSut()
      jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rowCount: 0 }))
      const result = await sut.checkEmailInUse(params.email)
      expect(result).toBeFalsy()
    })
  })
  describe('create()', () => {
    test('Should return true when account register succeeds', async () => {
      const { sut, params } = makeSut()
      const result = await sut.create(params)
      expect(result).toBeTruthy()
    })
    test('Should return 500 when account register fails', async () => {
      const { sut, params } = makeSut()
      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })
      const result = sut.create(params)
      return expect(result).rejects.toThrow()
    })
  })
  describe('getUserByEmail()', () => {
    test('Should return an account model if succeeds', async () => {
      const { sut, params } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [params] }))

      const newResult = await sut.getUserByEmail(params.email)
      expect(newResult).toEqual(params)
    })
    test('Should return 500 when account query fails', async () => {
      const { sut, params } = makeSut()
      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })
      const result = sut.getUserByEmail(params.email)
      return expect(result).rejects.toThrow()
    })
  })
  describe('setuserById()', () => {
    test('Should return true when account updated succeeds', async () => {
      const { sut, params } = makeSut()
      const result = await sut.setUserById(params)
      expect(result).toBeTruthy()
    })
    test('Should throws if account updated fails', async () => {
      const { sut, params } = makeSut()
      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })
      const result = sut.setUserById(params)
      return expect(result).rejects.toThrow()
    })
  })
  describe('delete()', () => {
    test('Should return true when account updated succeeds', async () => {
      const { sut, params } = makeSut()
      const result = await sut.delete(params.id)
      expect(result).toBeTruthy()
    })
    test('Should throws if account updated fails', async () => {
      const { sut, params } = makeSut()
      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })
      const result = await sut.delete(params.id)
      return expect(result).toBeFalsy()
    })
  })
})
