import { client } from '@/database'
import { PgTeamRepository } from './postgres-team-repository'
import { makeFakePostgresTeamList, makeFakeTeam, makeFakeTeamList } from '@/mocks/teams/make-fake-team'

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
        name,
        created_at,
        COALESCE(members, ARRAY[]::text[]) AS members
        FROM teams
        ORDER BY name DESC
        LIMIT $1
        OFFSET $2::integer * $1::integer
      `

const makeSut = () => {
  const sut = new PgTeamRepository()
  const params = makeFakeTeam()

  return {
    sut, params,
  }
}

describe('Postgres Team Repository', () => {
  describe('getTeamByID()', () => {
    test('Should return an account model if succeeds', async () => {
      const { sut, params } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [params] }))

      const newResult = await sut.getTeamByID(params.id)
      expect(newResult).toEqual(params)
    })
    test('Should return undefined when account query fails', async () => {
      const { sut, params } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = await sut.getTeamByID(params.id)
      expect(result).toBe(undefined)
    })
  })
  describe('getAllTeams()', () => {
    test('Should return an account model list if succeeds', async () => {
      const { sut } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: makeFakePostgresTeamList() }))

      const newResult = await sut.getAllTeams(fakeRequestParams)
      expect(newResult).toEqual(makeFakeTeamList())
    })
    test('Should query is called with correct values', async () => {
      const { sut } = makeSut()

      const querySpy = jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: makeFakePostgresTeamList() }))

      await sut.getAllTeams(fakeRequestParams)

      expect(querySpy).toHaveBeenCalledWith(querySql, ['10', '0'])

      fakeRequestParams.page = '2'
      fakeRequestParams.offset = '10'

      await sut.getAllTeams(fakeRequestParams)

      expect(querySpy).toHaveBeenCalledWith(querySql, ['10', '10'])

      fakeRequestParams.page = '5'
      fakeRequestParams.offset = '40'

      await sut.getAllTeams(fakeRequestParams)

      expect(querySpy).toHaveBeenCalledWith(querySql, ['10', '40'])
    })
    test('Should return an empty list when account query fails', async () => {
      const { sut } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = await sut.getAllTeams(fakeRequestParams)
      expect(result).toEqual([])
    })
  })
})
