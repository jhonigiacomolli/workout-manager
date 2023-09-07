import { makeFakePostgressWorkspace, makeFakeWorkspace } from '@/mocks/workspace/make-fake-workspace'
import { PgWorkspaceReposytory } from './postgres-workspace-repository'
import { client } from '@/database'

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: () => ({
      rows: [makeFakePostgressWorkspace()],
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
      SELECT * FROM workspaces
      ORDER BY name DESC
      LIMIT $1
      OFFSET $2:: integer * $1:: integer;
    `
const querySqlOrderByCreatedAt = `
      SELECT * FROM workspaces
      ORDER BY created_at DESC
      LIMIT $1
      OFFSET $2:: integer * $1:: integer;
    `

const makeSut = () => {
  const sut = new PgWorkspaceReposytory()
  const { id, ...params } = makeFakeWorkspace()
  const paramsWithId = { id, ...params }

  return {
    sut, params, paramsWithId,
  }
}
describe('PostgresWorkspaceReposytory', () => {
  describe('create()', () => {
    test('Should return undefined if workspace register fails', async () => {
      jest.spyOn(client, 'query').mockImplementationOnce(() => ({
        rows: [],
        rowCount: 0,
      }))

      const { sut, params } = makeSut()

      const result = await sut.create(params)
      return expect(result).toBeUndefined()
    })
    test('Should throws when workspace register throws', async () => {
      const { sut, params } = makeSut()
      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })
      const result = sut.create(params)
      return expect(result).rejects.toThrow()
    })
    test('Should return workspace model if register succeeds', async () => {
      const { sut, params } = makeSut()
      const result = await sut.create(params)
      expect(result).toEqual(makeFakeWorkspace())
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

      jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [makeFakePostgressWorkspace()] }))

      const newResult = await sut.getAll(fakeRequestParams)
      expect(newResult).toEqual([makeFakePostgressWorkspace()])
    })
    test('Should query is called with correct values', async () => {
      const { sut } = makeSut()

      const querySpy = jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [makeFakePostgressWorkspace()] }))

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

      const querySpy = jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [makeFakePostgressWorkspace()] }))

      fakeRequestParams.orderBy = 'createdAt'

      await sut.getAll(fakeRequestParams)

      expect(querySpy).toHaveBeenCalledWith(querySqlOrderByCreatedAt, ['10', '0'])
    })
    test('Should thorws an erro when account query fails', async () => {
      const { sut } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = sut.getAll(fakeRequestParams)
      await expect(result).rejects.toThrow()
    })
  })
  describe('getById()', () => {
    test('Should return an workspace model if succeeds', async () => {
      const { sut, paramsWithId } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [makeFakePostgressWorkspace()] }))

      const newResult = await sut.getById(paramsWithId.id)

      expect(newResult).toEqual(paramsWithId)
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
