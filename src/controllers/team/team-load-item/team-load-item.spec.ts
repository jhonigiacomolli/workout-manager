import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { NotFoundError } from '@/helpers/errors'
import { TeamStub } from '@/mocks/teams/team-stub'
import { TeamLoadItemController } from './team-load-item'

const makeSut = () => {
  const fakeRequest = makeFakeRequest()
  const teamStub = new TeamStub()
  const sut = new TeamLoadItemController({
    team: teamStub,
  })

  return {
    sut,
    fakeRequest,
    teamStub,
  }
}
describe('TeamLoadItemController', () => {
  test('Should return 400 if teamId is not provided', async () => {
    const { sut } = makeSut()
    const fakeInvalidRequest = makeFakeRequest({ params: {} })

    const result = sut.handle(fakeInvalidRequest)

    await expect(result).rejects.toThrow(new NotFoundError('Required param teamId is not provided'))
  })

  test('Should return 404 if teamId is a invalid teamId', async () => {
    const { sut, fakeRequest, teamStub } = makeSut()

    jest.spyOn(teamStub, 'getTeamByID').mockReturnValueOnce(Promise.resolve(undefined))

    const result = sut.handle(fakeRequest)
    await expect(result).rejects.toThrow(new NotFoundError('Team not found'))
  })

  test('Should return 200 with team data if succeeds', async () => {
    const { sut, fakeRequest } = makeSut()
    const result = await sut.handle(fakeRequest)

    expect(result).toEqual(httpResponse(200, {
      id: 'valid_team_id',
      name: 'any_name',
      createdAt: '2023-06-30T03:00:00.000Z',
      members: [],
    }))
  })
})
