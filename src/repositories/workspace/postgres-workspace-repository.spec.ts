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
})
