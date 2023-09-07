import { TeamStub } from '@/mocks/teams/team-stub'
import { TeamLoadAllItemsController } from './team-load-all-items'
import { httpRequest, httpResponse } from '@/helpers/http'
import { makeFakeTeamList } from '@/mocks/teams/team-fakes'
import { InvalidParamError } from '@/helpers/errors'

const fakeRequest = httpRequest({}, {}, {}, {
  pagination: {
    limit: '10',
    page: '1',
    offset: '0',
    order: 'DESC',
    orderBy: 'id',
  },
})

const makeSut = () => {
  const teamStub = new TeamStub()
  const sut = new TeamLoadAllItemsController({
    team: teamStub,
  })

  return {
    sut,
    teamStub,
  }
}

describe('TeamLoadAllItemsController', () => {
  test('Should return a list of teams', async () => {
    const { sut } = makeSut()

    const result = await sut.handle(fakeRequest)

    expect(result).toEqual(httpResponse(200, makeFakeTeamList()))
  })
  test('Should return a empty list of teams if not have entries on db', async () => {
    const { sut, teamStub } = makeSut()

    jest.spyOn(teamStub, 'getAllTeams').mockReturnValueOnce(Promise.resolve([]))

    const result = await sut.handle(fakeRequest)

    expect(result).toEqual(httpResponse(200, []))
  })
  test('Should getAll method calls with corred params if invalid orderby param is provided', async () => {
    const { sut } = makeSut()

    const fakeRequestWithInvalidParam = {
      ...fakeRequest,
      query: {
        ...fakeRequest.query,
        pagination: {
          ...fakeRequest.query.pagination,
          orderBy: 'wrong',
        },
      },
    }
    const output = sut.handle(fakeRequestWithInvalidParam)

    await expect(output).rejects.toThrow(new InvalidParamError('orderBy, accepted params(id,name,members)'))
  })
  test('Should getAllTeams to have been called with correct params', async () => {
    const { sut, teamStub } = makeSut()

    const methodSpy = jest.spyOn(teamStub, 'getAllTeams')
    await sut.handle(fakeRequest)

    expect(methodSpy).toHaveBeenCalledWith({
      limit: '10',
      page: '1',
      offset: '0',
      order: 'DESC',
      orderBy: 'id',
    })

    fakeRequest.query.pagination.limit = '4'
    fakeRequest.query.pagination.page = '1'
    fakeRequest.query.pagination.offset = '0'

    await sut.handle(fakeRequest)

    expect(methodSpy).toHaveBeenCalledWith({
      ...fakeRequest.query.pagination,
      order: 'DESC',
      orderBy: 'id',
    })
  })
  test('Should return 500 if loadAll method throws', async () => {
    const { sut, teamStub } = makeSut()

    jest.spyOn(teamStub, 'getAllTeams').mockImplementationOnce(() => { throw new Error() })

    const result = sut.handle(fakeRequest)

    await expect(result).rejects.toThrow()
  })
})
