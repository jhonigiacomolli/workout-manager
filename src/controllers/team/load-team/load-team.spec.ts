import { httpRequest, httpResponse } from '@/helpers/http'
import { LoadTeamController } from './load-team'
import { TeamStub } from '@/mocks/teams/team-stub'

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
    const result = await sut.handle(fakeInvalidRequest)
    expect(result).toEqual(httpResponse(400, 'Required param teamId is not provided'))

    const newResult = await sut.handle(fakeInvalidRequest)
    expect(newResult).toEqual(httpResponse(400, 'Required param teamId is not provided'))
  })
  test('Should return 404 if teamId is a invalid teamId', async () => {
    const { sut, teamStub } = makeSut()

    jest.spyOn(teamStub, 'getTeamByID').mockReturnValueOnce(Promise.resolve(undefined))

    const result = await sut.handle(fakeValidRequest)
    expect(result).toEqual(httpResponse(404, 'Team not found'))
  })
  test('Should return 200 with team data if succeeds', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(fakeValidRequest)

    expect(result).toEqual(httpResponse(200, {
      data: {
        id: 'valid_team_id',
        name: 'any_name',
        members: [],
      },
    }))
  })
})
