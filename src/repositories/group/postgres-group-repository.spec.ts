import { client } from '@/database'
import { PgGroupRepository } from './postgres-group-repository'
import { makeFakeGroup, makeFakePostgresGroup } from '@/mocks/group/group-fakes'

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: () => ({
      rows: [makeFakePostgresGroup()],
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
      SELECT * FROM groups
      ORDER BY name DESC
      LIMIT $1
      OFFSET $2:: integer * $1:: integer;
    `
const querySqlOrderByCreatedAt = `
      SELECT * FROM groups
      ORDER BY created_at DESC
      LIMIT $1
      OFFSET $2:: integer * $1:: integer;
    `

const makeSut = () => {
  const sut = new PgGroupRepository()
  const { id, ...params } = makeFakeGroup()
  const paramsWithId = { id, ...params }

  return {
    sut, params, paramsWithId,
  }
}
describe('PostgresGroupRepository', () => {
  describe('create()', () => {
    test('Should return undefined if board register fails', async () => {
      jest.spyOn(client, 'query').mockImplementationOnce(() => ({
        rows: [],
        rowCount: 0,
      }))

      const { sut, params } = makeSut()

      const result = await sut.create(params)
      return expect(result).toBeUndefined()
    })

    test('Should throws when board register throws', async () => {
      const { sut, params } = makeSut()
      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })
      const result = sut.create(params)
      return expect(result).rejects.toThrow()
    })

    test('Should return board model if register succeeds', async () => {
      const { sut, params } = makeSut()
      const result = await sut.create(params)
      expect(result).toEqual(makeFakeGroup())
    })
  })
  describe('delete()', () => {
    test('Should return true when team remove succeeds', async () => {
      const { sut, paramsWithId } = makeSut()
      const result = await sut.delete(paramsWithId.id)
      expect(result).toBeTruthy()
    })

    test('Should return false id id is not provided', async () => {
      const { sut } = makeSut()
      const result = await sut.delete('')
      expect(result).toBeFalsy()
    })

    test('Should return 500 when team remove fails', async () => {
      const { sut, paramsWithId } = makeSut()
      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })
      const result = sut.delete(paramsWithId.id)
      return expect(result).rejects.toThrow()
    })
  })

  describe('getAll()', () => {
    test('Should return an account model list if succeeds', async () => {
      const { sut } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [makeFakePostgresGroup()] }))

      const newResult = await sut.getAll(fakeRequestParams)
      expect(newResult).toEqual([makeFakeGroup()])
    })

    test('Should query is called with correct values', async () => {
      const { sut } = makeSut()

      const querySpy = jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [makeFakePostgresGroup()] }))

      await sut.getAll(fakeRequestParams)

      expect(querySpy).toHaveBeenCalledWith(querySql, ['10', '0'])

      const fakeRequestParamsWithPagination = {
        ...fakeRequestParams,
        page: '2',
        offset: '10',
      }

      await sut.getAll(fakeRequestParamsWithPagination)

      expect(querySpy).toHaveBeenCalledWith(querySql, ['10', '10'])

      const fakeRequestParamsWithNewPagination = {
        ...fakeRequestParams,
        page: '5',
        offset: '40',
      }

      await sut.getAll(fakeRequestParamsWithNewPagination)

      expect(querySpy).toHaveBeenCalledWith(querySql, ['10', '40'])
    })

    test('Should query is called with correct values if invalid orderby field is provided', async () => {
      const { sut } = makeSut()

      const querySpy = jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [makeFakePostgresGroup()] }))

      fakeRequestParams.orderBy = 'createdAt'

      const output = await sut.getAll(fakeRequestParams)

      expect(querySpy).toHaveBeenCalledWith(querySqlOrderByCreatedAt, ['10', '0'])
      expect(output).toEqual([makeFakeGroup()])
    })

    test('Should thorws an erro when account query fails', async () => {
      const { sut } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = sut.getAll(fakeRequestParams)
      await expect(result).rejects.toThrow()
    })
  })

  describe('getById()', () => {
    test('Should return an board model if succeeds', async () => {
      const { sut, paramsWithId } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [makeFakePostgresGroup()] }))

      const newResult = await sut.getById(paramsWithId.id)

      expect(newResult).toEqual(makeFakeGroup())
    })
    test('Should throws when team query fails', async () => {
      const { sut, paramsWithId } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = sut.getById(paramsWithId.id)
      await expect(result).rejects.toThrow()
    })
  })

  describe('setById()', () => {
    test('Should return true if succeeds', async () => {
      const { sut, params, paramsWithId } = makeSut()

      const newResult = await sut.setById(paramsWithId.id, params)

      expect(newResult).toEqual(paramsWithId)
    })
    test('Should throws when team query fails', async () => {
      const { sut, params, paramsWithId } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = sut.setById(paramsWithId.id, params)
      await expect(result).rejects.toThrow()
    })
  })
})
