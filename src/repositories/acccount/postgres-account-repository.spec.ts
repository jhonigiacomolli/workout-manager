import { client } from '@/database'
import { PgAccountRepository } from './postgres-account-repository'
import { makeFakeAccount, makePostgresFakeAccount } from '@/mocks/account/make-fake-account'

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: () => ({
      rows: [makeFakeAccount()],
      rowCount: 1,
    }),
    end: jest.fn(),
  }
  return { Client: jest.fn(() => mClient) }
})

const fakeRequestParams = {
  host: 'localhost',
  page: '1',
  limit: '10',
  offset: '0',
  order: 'DESC',
  orderBy: 'name',
}

const querySql = `
        SELECT
        id,
        COALESCE(name, '') as name,
        created_at,
        COALESCE(email, '') as email,
        COALESCE(image, '') as image,
        COALESCE(permissions, ARRAY[]::text[]) AS permissions,
        COALESCE(phone, '') as phone,
        COALESCE(address, '') as address,
        COALESCE(boards, ARRAY[]::text[]) AS boards,
        COALESCE(desktops, ARRAY[]::text[]) AS desktops,
        COALESCE(responsability, ARRAY[]::text[]) AS responsability,
        COALESCE(status, ARRAY[]::text[]) AS status,
        COALESCE(tasks, ARRAY[]::text[]) AS tasks,
        teamId
        FROM accounts
        ORDER BY name DESC
        LIMIT $1
        OFFSET $2::integer * $1::integer
      `

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
      expect(result).toEqual(makeFakeAccount())
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
  describe('getUserById()', () => {
    test('Should return an account model if succeeds', async () => {
      const { sut, params } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [params] }))

      const newResult = await sut.getUserById(params.id)
      expect(newResult).toEqual(params)
    })
    test('Should return 500 when account query fails', async () => {
      const { sut, params } = makeSut()
      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })
      const result = sut.getUserByEmail(params.email)
      return expect(result).rejects.toThrow()
    })
  })
  describe('getAllAccounts()', () => {
    test('Should return an account model list if succeeds', async () => {
      const { sut } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [makePostgresFakeAccount()] }))

      const newResult = await sut.getAllAccounts(fakeRequestParams)
      expect(newResult).toEqual([makeFakeAccount()])
    })
    test('Should query is called with correct values', async () => {
      const { sut } = makeSut()

      const querySpy = jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [makePostgresFakeAccount()] }))

      await sut.getAllAccounts(fakeRequestParams)

      expect(querySpy).toHaveBeenCalledWith(querySql, ['10', '0'])

      fakeRequestParams.page = '2'
      fakeRequestParams.offset = '10'

      await sut.getAllAccounts(fakeRequestParams)

      expect(querySpy).toHaveBeenCalledWith(querySql, ['10', '10'])

      fakeRequestParams.page = '5'
      fakeRequestParams.offset = '40'

      await sut.getAllAccounts(fakeRequestParams)

      expect(querySpy).toHaveBeenCalledWith(querySql, ['10', '40'])
    })
    test('Should thorws an erro when account query fails', async () => {
      const { sut } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = sut.getAllAccounts(fakeRequestParams)
      await expect(result).rejects.toThrow()
    })
  })
  describe('setuserById()', () => {
    test('Should return true when account updated succeeds', async () => {
      const { sut, params } = makeSut()
      const { id, ...data } = params
      const result = await sut.setUserById(id, data)
      expect(result).toBeTruthy()
    })
    test('Should throws if account updated fails', async () => {
      const { sut, params } = makeSut()
      const { id, ...data } = params
      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })
      const result = sut.setUserById(id, data)
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
      const result = sut.delete(params.id)
      await expect(result).rejects.toThrow()
    })
  })
})
