import { TeamStub } from '@/mocks/teams/team-stub'
import { httpRequest, httpResponse } from '@/helpers/http'
import { AccountStub } from '@/mocks/account/account-stub'
import { BadRequestError, EmptyParamError } from '@/helpers/errors'
import { makeFakeAccount } from '@/mocks/account/make-fake-account'
import { AccountUdateController } from './account-update-controller'

const makeSut = () => {
  const body = {
    ...makeFakeAccount(),
    passwordConfirmation: makeFakeAccount().password,
  }
  const headers = {
    authorization: 'valid_access_token',
  }
  const fakeRequest = httpRequest(body, headers, { id: 'any_team_id' })

  const accountStub = new AccountStub()
  const teamStub = new TeamStub()

  const sut = new AccountUdateController({
    account: accountStub,
    team: teamStub,
  })

  return {
    sut,
    accountStub,
    teamStub,
    fakeRequest,
  }
}

describe('Account Update Controller', () => {
  test('Should return 400 if setUserById method return false', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()

    jest.spyOn(accountStub, 'setUserById').mockReturnValueOnce(Promise.resolve(false))

    const result = sut.handle(fakeRequest)

    await expect(result).rejects.toThrow(new BadRequestError('Account update fails'))
  })
  test('Should return 500 if setUserById method throws', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()

    jest.spyOn(accountStub, 'setUserById').mockImplementationOnce(() => {
      throw new Error()
    })

    const result = sut.handle(fakeRequest)

    await expect(result).rejects.toThrow()
  })
  test('Should return 400 if id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const worngRequest = { ...fakeRequest }

    worngRequest.params = {}

    const result = sut.handle(worngRequest)

    await expect(result).rejects.toThrow(new EmptyParamError('id'))
  })
  test('Should return 400 if name is not provided on body', async () => {
    const { sut, fakeRequest } = makeSut()

    const result = sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        name: '',
      },
    })

    await expect(result).rejects.toThrow(new EmptyParamError('name'))
  })
  test('Should return 400 if email is not provided on body', async () => {
    const { sut, fakeRequest } = makeSut()

    const result = sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        email: '',
      },
    })

    await expect(result).rejects.toThrow(new EmptyParamError('email'))
  })
  test('Should return 400 if teamId is invalid', async () => {
    const { sut, fakeRequest, teamStub } = makeSut()

    jest.spyOn(teamStub, 'getTeamByID').mockReturnValueOnce(Promise.resolve(undefined))

    const result = sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        teamId: 'invalid_team_id',
      },
    })

    await expect(result).rejects.toThrow(new BadRequestError('Invalid param: teamId'))
  })
  test('Should return 200 when update successfull', async () => {
    const { sut, fakeRequest } = makeSut()

    const result = await sut.handle(fakeRequest)

    expect(result).toEqual(httpResponse(201, 'User updated successfully'))
  })
})
