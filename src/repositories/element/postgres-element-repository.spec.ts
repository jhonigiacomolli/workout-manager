import { client } from '@/database'
import { makeFakeElement } from '@/mocks/element/element-fakes'
import { PgElementRepository, PostgresElementModel } from './postgres-element-repository'

const makeFakePostgresElement = (): PostgresElementModel => ({
  id: 'any-id',
  created_at: '12/10/2023',
  end_date: '',
  start_date: '',
  expected_date: '',
  status: 'waiting',
  group: 'any-group',
  members: [],
  title: 'any-element-title',
  updates: [],
})

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: () => ({
      rows: [makeFakePostgresElement()],
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
        COALESCE(created_at, TIMESTAMP '1970-01-01 00:00:00') as created_at,
        COALESCE(title, '') as title,
        COALESCE("group", '') as "group",
        COALESCE(members, ARRAY[]::text[]) AS members,
        COALESCE(status, '') as status,
        COALESCE(expected_date, TIMESTAMP '1970-01-01 00:00:00') as expected_date,
        COALESCE(start_date, TIMESTAMP '1970-01-01 00:00:00') as start_date,
        COALESCE(end_date, TIMESTAMP '1970-01-01 00:00:00') as end_date,
        COALESCE(updates, ARRAY[]::text[]) AS updates
      FROM elements
      ORDER BY name DESC
      LIMIT $1
      OFFSET $2::integer * $1::integer
    `

const makeSut = () => {
  const sut = new PgElementRepository()
  const { id, createdAt, ...updateParams } = makeFakeElement()

  return {
    sut,
    id,
    updateParams,
  }
}

describe('Postgres Element Repository', () => {
  describe('create()', () => {
    test('Should return true when team register succeeds', async () => {
      const { sut, updateParams } = makeSut()
      const result = await sut.create(updateParams)
      expect(result).toEqual(makeFakeElement())
    })
    test('Should return 500 when team register fails', async () => {
      const { sut, updateParams } = makeSut()
      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })
      const result = sut.create(updateParams)
      return expect(result).rejects.toThrow()
    })
  })
  describe('delete()', () => {
    test('Should return true when team remove succeeds', async () => {
      const { sut, id } = makeSut()
      const result = await sut.delete(id)
      expect(result).toBeTruthy()
    })
    test('Should return false id id is not provided', async () => {
      const { sut } = makeSut()
      const result = await sut.delete('')
      expect(result).toBeFalsy()
    })
    test('Should return 500 when team remove fails', async () => {
      const { sut, id } = makeSut()
      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })
      const result = sut.delete(id)
      return expect(result).rejects.toThrow()
    })
  })
  describe('getElementByID()', () => {
    test('Should return an team model if succeeds', async () => {
      const { sut, id } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [makeFakePostgresElement()] }))

      const newResult = await sut.getById(id)
      expect(newResult).toEqual(makeFakeElement())
    })
    test('Should throws when team query fails', async () => {
      const { sut, id } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = sut.getById(id)
      await expect(result).rejects.toThrow()
    })
  })
  describe('getAllElements()', () => {
    test('Should return an team model list if succeeds', async () => {
      const { sut } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [makeFakePostgresElement()] }))

      const newResult = await sut.getAll(fakeRequestParams)
      expect(newResult).toEqual([makeFakeElement()])
    })
    test('Should query is called with correct values', async () => {
      const { sut } = makeSut()

      const querySpy = jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [makeFakePostgresElement()] }))

      await sut.getAll(fakeRequestParams)

      expect(querySpy).toHaveBeenCalledWith(querySql, ['10', '0'])

      fakeRequestParams.page = '2'
      fakeRequestParams.offset = '10'

      await sut.getAll(fakeRequestParams)

      expect(querySpy).toHaveBeenCalledWith(querySql, ['10', '10'])

      fakeRequestParams.page = '5'
      fakeRequestParams.offset = '40'

      await sut.getAll(fakeRequestParams)

      expect(querySpy).toHaveBeenCalledWith(querySql, ['10', '40'])
    })
    test('Should throws when team query fails', async () => {
      const { sut } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = sut.getAll(fakeRequestParams)
      await expect(result).rejects.toThrow()
    })
  })
  describe('setElementById()', () => {
    test('Should return true if succeeds', async () => {
      const { sut, id, updateParams } = makeSut()

      const newResult = await sut.setById(id, updateParams)

      expect(newResult).toBeTruthy()
    })
    test('Should throws when team query fails', async () => {
      const { sut, id, updateParams } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = sut.setById(id, updateParams)
      await expect(result).rejects.toThrow()
    })
  })
})
