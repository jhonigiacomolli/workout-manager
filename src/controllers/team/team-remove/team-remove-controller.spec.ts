import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { TeamStub } from '@/mocks/teams/team-stub'
import { TeamRemoveController } from './team-remove-controller'
import { BadRequestError, EmptyParamError } from '@/helpers/errors'

const makeSut = () => {
  const fakeRequest = makeFakeRequest()
  const teamStub = new TeamStub()
  const sut = new TeamRemoveController({
    team: teamStub,
  })

  return {
    sut,
    fakeRequest,
    teamStub,
  }
}

describe('TeamRemoveController', () => {
  test('Should return 400 if teamId is not provided', async () => {
    const { sut } = makeSut()
    const fakeRequestWithoutId = makeFakeRequest({ params: {} })

    const output = sut.handle(fakeRequestWithoutId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should calls delete mothod with teamId', async () => {
    const { sut, fakeRequest, teamStub } = makeSut()

    const teamSpy = jest.spyOn(teamStub, 'delete')

    await sut.handle(fakeRequest)

    expect(teamSpy).toHaveBeenCalledWith(fakeRequest.params.id)
    expect(teamSpy).not.toHaveBeenCalledWith('other_value')
  })

  test('Should return 400 if delete method return false', async () => {
    const { sut, fakeRequest, teamStub } = makeSut()

    jest.spyOn(teamStub, 'delete').mockReturnValueOnce(Promise.resolve(false))

    const result = sut.handle(fakeRequest)

    await expect(result).rejects.toThrow(new BadRequestError('Team removal failed!'))
  })

  test('Should return 204 if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const result = await sut.handle(fakeRequest)

    expect(result).toEqual(httpResponse(200, 'Team removed'))
  })
})
