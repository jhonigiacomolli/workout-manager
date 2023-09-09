import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { TeamStub } from '@/mocks/teams/team-stub'
import { AccountStub } from '@/mocks/account/account-stub'
import { makeFakeAccount } from '@/mocks/account/account-fakes'
import { AccountUdateController } from './account-update-controller'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

const makeSut = () => {
  const fakeRequest = makeFakeRequest({
    body: {
      ...makeFakeAccount(),
      passwordConfirmation: makeFakeAccount().password,
    },
  })

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

    jest.spyOn(accountStub, 'setUserById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Account update fails'))
  })

  test('Should return 500 if setUserById method throws', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()

    jest.spyOn(accountStub, 'setUserById').mockImplementationOnce(() => {
      throw new Error()
    })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should return 400 if id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const worngRequest = { ...fakeRequest }

    worngRequest.params = {}

    const output = sut.handle(worngRequest)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should return 400 if name is not provided on body', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        name: '',
      },
    })

    await expect(output).rejects.toThrow(new EmptyParamError('name'))
  })

  test('Should return 400 if email is not provided on body', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        email: '',
      },
    })

    await expect(output).rejects.toThrow(new EmptyParamError('email'))
  })

  test('Should return 400 if teamId is invalid', async () => {
    const { sut, fakeRequest, teamStub } = makeSut()

    jest.spyOn(teamStub, 'getTeamByID').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        teamId: 'invalid_team_id',
      },
    })

    await expect(output).rejects.toThrow(new InvalidParamError('teamId'))
  })

  test('Should return 200 when update successfull', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, {
      message: 'User updated successffuly',
      data: makeFakeAccount(),
    }))
  })
})
