import { httpRequest, httpResponse } from '@/helpers/http'
import { LoadTeamController } from './load-team'
import { TeamStub } from '@/mocks/teams/team-stub'

const fakeValidRequest = httpRequest({
  teamId: 'valid_team_id',
}, {})

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
  })
  test('Should return 404 if teamId is a invalid teamId', async () => {
    const { sut, teamStub } = makeSut()

    jest.spyOn(teamStub, 'getTeamByID').mockReturnValueOnce(Promise.resolve(undefined))

    const result = await sut.handle(fakeValidRequest)
    expect(result).toEqual(httpResponse(404, 'Invalid param: teamId'))
  })
  test('Should return 500 if any method thrwos', async () => {
    const { sut, teamStub } = makeSut()

    jest.spyOn(teamStub, 'getTeamByID').mockImplementationOnce(() => { throw new Error() })

    const result = await sut.handle(fakeValidRequest)
    expect(result).toEqual(httpResponse(500, 'Internal Server Error'))
  })
  test('Should return 200 with team data if succeeds', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(fakeValidRequest)
    expect(result).toEqual(httpResponse(200, {
      data: {
        id: 'any_team_id',
        title: 'any_title',
        members: [],
      },
    }))
  })
})
