import { httpResponse } from '@/helpers/http'
import { TeamStub } from '@/mocks/teams/team-stub'
import { InvalidParamError } from '@/helpers/errors'
import { makeFakeTeamList } from '@/mocks/teams/team-fakes'
import { TeamLoadAllItemsController } from './team-load-all-items'
import { fakePaginationDefault, makeFakeRequest } from '@/mocks/http'

const makeSut = () => {
  const fakeRequest = makeFakeRequest()
  const teamStub = new TeamStub()
  const sut = new TeamLoadAllItemsController({
    team: teamStub,
  })

  return {
    sut,
    fakeRequest,
    teamStub,
  }
}

describe('TeamLoadAllItemsController', () => {
  test('Should return a list of teams', async () => {
    const { sut, fakeRequest } = makeSut()

    const result = await sut.handle(fakeRequest)

    expect(result).toEqual(httpResponse(200, makeFakeTeamList()))
  })

  test('Should return a empty list of teams if not have entries on db', async () => {
    const { sut, fakeRequest, teamStub } = makeSut()

    jest.spyOn(teamStub, 'getAllTeams').mockReturnValueOnce(Promise.resolve([]))

    const result = await sut.handle(fakeRequest)

    expect(result).toEqual(httpResponse(200, []))
  })

  test('Should getAll method calls with corred params if invalid orderby param is provided', async () => {
    const { sut } = makeSut()
    const fakeRequestWithInvalidParam = makeFakeRequest({
      query: {
        pagination: {
          ...fakePaginationDefault,
          orderBy: 'wrong',
        },
      },
    })

    const output = sut.handle(fakeRequestWithInvalidParam)

    await expect(output).rejects.toThrow(new InvalidParamError('orderBy, accepted params(id,name,members)'))
  })

  test('Should getAllTeams to have been called with correct params', async () => {
    const { sut, fakeRequest, teamStub } = makeSut()

    const methodSpy = jest.spyOn(teamStub, 'getAllTeams')
    await sut.handle(fakeRequest)

    expect(methodSpy).toHaveBeenCalledWith(fakePaginationDefault)

    const fakeRequestWithLimit = makeFakeRequest({
      query: {
        pagination: {
          ...fakePaginationDefault,
          limit: '4',
          page: '1',
          offset: '0',
        },
      },
    })

    await sut.handle(fakeRequestWithLimit)

    expect(methodSpy).toHaveBeenCalledWith({
      ...fakePaginationDefault,
      order: 'DESC',
      orderBy: 'id',
    })
  })

  test('Should return 500 if loadAll method throws', async () => {
    const { sut, fakeRequest, teamStub } = makeSut()

    jest.spyOn(teamStub, 'getAllTeams').mockImplementationOnce(() => { throw new Error() })

    const result = sut.handle(fakeRequest)

    await expect(result).rejects.toThrow()
  })
})
