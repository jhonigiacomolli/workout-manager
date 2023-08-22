import { httpRequest, httpResponse } from '@/helpers/http'
import { LoadTeamController } from './load-team'
import { TeamStub } from '@/mocks/teams/team-stub'
import { NotFoundError } from '@/helpers/errors'

const fakeValidRequest = httpRequest({}, {}, {
  id: 'valid_team_id',
})

const fakeInvalidRequest = httpRequest({}, {})

const makeSut = () => {
  const teamStub = new TeamStub()
  const sut = new LoadTeamController({
    team: teamStub,
  })

  return {
    sut,
    teamStub,
  }
}
describe('LoadTeamController', () => {
  test('Should return 400 if teamId is not provided', async () => {
    const { sut } = makeSut()

    const result = sut.handle(fakeInvalidRequest)

    await expect(result).rejects.toThrow(new NotFoundError('Required param teamId is not provided'))
  })
  test('Should return 404 if teamId is a invalid teamId', async () => {
    const { sut, teamStub } = makeSut()

    jest.spyOn(teamStub, 'getTeamByID').mockReturnValueOnce(Promise.resolve(undefined))

    const result = sut.handle(fakeValidRequest)
    await expect(result).rejects.toThrow(new NotFoundError('Team not found'))
  })
  test('Should return 200 with team data if succeeds', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(fakeValidRequest)

    expect(result).toEqual(httpResponse(200, {
      id: 'valid_team_id',
      name: 'any_name',
      createdAt: '2023-06-30T03:00:00.000Z',
      members: [],
    }))
  })
})
