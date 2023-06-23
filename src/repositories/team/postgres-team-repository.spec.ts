import { makeFakeTeam } from '@/mocks/teams/make-fake-team'
import { PgTeamRepository } from './postgres-team-repository'
import { client } from '@/database'

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
    test('Should return 500 when account query fails', async () => {
      const { sut, params } = makeSut()

      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })

      const result = sut.getTeamByID(params.id)
      return expect(result).rejects.toThrow()
    })
  })
})
