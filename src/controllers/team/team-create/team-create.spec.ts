import { TeamStub } from '@/mocks/teams/team-stub'
import { EmptyParamError } from '@/helpers/errors'
import { TeamCreateController } from './team-create'
import { httpRequest, httpResponse } from '@/helpers/http'
import { makeFakeTeam } from '@/mocks/teams/team-fakes'

const fakeRequest = httpRequest({
  name: 'valid_team_title',
})
const fakeEmptyRequest = httpRequest({})

const makeSut = () => {
  const teamStub = new TeamStub()
  const sut = new TeamCreateController({
    team: teamStub,
  })

  return {
    teamStub,
    sut,
  }
}

describe('TeamCreateController', () => {
  test('Should return an http response', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(fakeRequest)
    expect(result).toHaveProperty('statusCode')
    expect(result).toHaveProperty('body')
  })
  test('Should return 200 if team created succesfully', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(fakeRequest)
    expect(result).toEqual(httpResponse(200, {
      message: 'Successfully registered team',
      data: makeFakeTeam(),
    }))
  })
  test('Should return 400 if title param is not provided', async () => {
    const { sut } = makeSut()
    const result = sut.handle(fakeEmptyRequest)
    await expect(result).rejects.toThrow(new EmptyParamError('name'))
  })
  test('Should return 500 if method throws when create new team', async () => {
    const { sut, teamStub } = makeSut()
    jest.spyOn(teamStub, 'create').mockImplementationOnce(() => { throw new Error() })
    const result = sut.handle(fakeRequest)
    await expect(result).rejects.toThrow()
  })
})
