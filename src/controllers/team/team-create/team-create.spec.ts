import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { TeamStub } from '@/mocks/teams/team-stub'
import { EmptyParamError } from '@/helpers/errors'
import { TeamCreateController } from './team-create'
import { makeFakeTeam } from '@/mocks/teams/team-fakes'

const makeSut = () => {
  const { id, ...body } = makeFakeTeam()
  const fakeRequest = makeFakeRequest({ body })
  const teamStub = new TeamStub()
  const sut = new TeamCreateController({
    team: teamStub,
  })

  return {
    sut,
    fakeRequest,
    teamStub,
  }
}

describe('TeamCreateController', () => {
  test('Should return an http response', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toHaveProperty('statusCode')
    expect(output).toHaveProperty('body')
  })

  test('Should return 200 if team created succesfully', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, {
      message: 'Successfully registered team',
      data: makeFakeTeam(),
    }))
  })

  test('Should return 400 if title param is not provided', async () => {
    const { sut } = makeSut()
    const fakeEmptyRequest = makeFakeRequest()

    const output = sut.handle(fakeEmptyRequest)

    await expect(output).rejects.toThrow(new EmptyParamError('name'))
  })

  test('Should return 500 if method throws when create new team', async () => {
    const { sut, fakeRequest, teamStub } = makeSut()
    jest.spyOn(teamStub, 'create').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })
})
