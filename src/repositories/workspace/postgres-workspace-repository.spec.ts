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

const makeSut = () => {
  const sut = new PgWorkspaceReposytory()
  const { id, ...params } = makeFakeWorkspace()

  return {
    sut, params,
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

      fakeRequestParams.page = '2'
      fakeRequestParams.offset = '10'

      await sut.getAll(fakeRequestParams)

      expect(querySpy).toHaveBeenCalledWith(querySql, ['10', '10'])

      fakeRequestParams.page = '5'
      fakeRequestParams.offset = '40'

      await sut.getAll(fakeRequestParams)

      expect(querySpy).toHaveBeenCalledWith(querySql, ['10', '40'])
    })
    test('Should thorws an erro when account query fails', async () => {
      const { sut } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = sut.getAll(fakeRequestParams)
      await expect(result).rejects.toThrow()
    })
  })
})
