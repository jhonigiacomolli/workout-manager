import { client } from '@/database'
import { PgTeamRepository } from './postgres-team-repository'
import { makeFakePostgresTeam, makeFakePostgresTeamList, makeFakeTeam, makeFakeTeamList } from '@/mocks/teams/team-fakes'

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: () => ({
      rows: [makeFakePostgresTeam()],
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

  const updateParams = {
    name: params.name,
    members: params.members,
  }

  return {
    sut,
    params,
    updateParams,
  }
}

describe('Postgres Team Repository', () => {
  describe('create()', () => {
    test('Should return true when team register succeeds', async () => {
      const { sut, params } = makeSut()
      const result = await sut.create(params)
      expect(result).toEqual(makeFakePostgresTeam())
    })
    test('Should return 500 when team register fails', async () => {
      const { sut, params } = makeSut()
      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })
      const result = sut.create(params)
      return expect(result).rejects.toThrow()
    })
  })
  describe('delete()', () => {
    test('Should return true when team remove succeeds', async () => {
      const { sut, params } = makeSut()
      const result = await sut.delete(params.id)
      expect(result).toBeTruthy()
    })
    test('Should return false id id is not provided', async () => {
      const { sut } = makeSut()
      const result = await sut.delete('')
      expect(result).toBeFalsy()
    })
    test('Should return 500 when team remove fails', async () => {
      const { sut, params } = makeSut()
      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })
      const result = sut.delete(params.id)
      return expect(result).rejects.toThrow()
    })
  })
  describe('getTeamByID()', () => {
    test('Should return an team model if succeeds', async () => {
      const { sut, params } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => ({ rows: [makeFakePostgresTeam()] }))

      const newResult = await sut.getTeamByID(params.id)
      expect(newResult).toEqual(params)
    })
    test('Should throws when team query fails', async () => {
      const { sut, params } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = sut.getTeamByID(params.id)
      await expect(result).rejects.toThrow()
    })
  })
  describe('getAllTeams()', () => {
    test('Should return an team model list if succeeds', async () => {
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
    test('Should throws when team query fails', async () => {
      const { sut } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = sut.getAllTeams(fakeRequestParams)
      await expect(result).rejects.toThrow()
    })
  })
  describe('setTeamById()', () => {
    test('Should return true if succeeds', async () => {
      const { sut, params, updateParams } = makeSut()

      const newResult = await sut.setTeamByID(params.id, updateParams)

      expect(newResult).toBeTruthy()
    })
    test('Should throws when team query fails', async () => {
      const { sut, params, updateParams } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = sut.setTeamByID(params.id, updateParams)
      await expect(result).rejects.toThrow()
    })
  })
})
