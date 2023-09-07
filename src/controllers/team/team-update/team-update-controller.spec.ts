import { httpRequest, httpResponse } from '@/helpers/http'
import { TeamUpdateController } from './team-update-controller'
import { BadRequestError, EmptyParamError, NotFoundError } from '@/helpers/errors'
import { makeFakeTeam } from '@/mocks/teams/team-fakes'
import { TeamStub } from '@/mocks/teams/team-stub'

const makeSut = () => {
  const requestBody = makeFakeTeam()
  const requestHeaders = {
    authorization: 'valid_access_token',
  }
  const requestParams = {
    id: 'any_account_id',
  }
  const fakeRequest = httpRequest(requestBody, requestHeaders, requestParams)

  const teamStub = new TeamStub()
  const sut = new TeamUpdateController({
    team: teamStub,
  })
  return {
    sut,
    fakeRequest,
    teamStub,
  }
}
describe('TeamUpdateController', () => {
  test('Should return 400 if team id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    const requestWithouParams = {
      ...fakeRequest,
      params: {},
    }

    const output = sut.handle(requestWithouParams)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })
  test('Should return 400 if team data is not provided on request body', async () => {
    const { sut, fakeRequest } = makeSut()
    const requestWithoutBody = {
      ...fakeRequest,
      body: {},
    }

    const output = sut.handle(requestWithoutBody)

    await expect(output).rejects.toThrow(new EmptyParamError('name'))
  })
  test('Should call setTeamById method with correct values', async () => {
    const { sut, fakeRequest, teamStub } = makeSut()

    const teamSpy = jest.spyOn(teamStub, 'setTeamByID')

    await sut.handle(fakeRequest)

    const output = {
      name: fakeRequest.body.name,
      members: fakeRequest.body.members,
    }

    expect(teamSpy).toHaveBeenCalledWith(fakeRequest.params.id, output)
  })
  test('Should return 404 if id provided is invalid', async () => {
    const { sut, fakeRequest, teamStub } = makeSut()

    jest.spyOn(teamStub, 'getTeamByID').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new NotFoundError('Team not found'))
  })
  test('Should return 400 if setTeamById return false', async () => {
    const { sut, fakeRequest, teamStub } = makeSut()

    jest.spyOn(teamStub, 'setTeamByID').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Team update fails!'))
  })
  test('Should return 200 if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, {
      message: 'Team update successfully!',
      data: makeFakeTeam(),
    }))
  })
})
