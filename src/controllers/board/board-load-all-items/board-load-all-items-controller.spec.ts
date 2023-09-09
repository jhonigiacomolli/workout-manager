import { httpRequest, httpResponse } from '@/helpers/http'
import { BoardStub } from '@/mocks/board/board-stub'
import { BoardLoadAllItemsController } from './board-load-all-items-controller'
import { InvalidParamError } from '@/helpers/errors'
import { makeFakeBoard } from '@/mocks/board/board-fakes'

const makeSut = () => {
  const fakeRequestBody = {}
  const fakeRequestHeaders = {}
  const fakeRequestParams = {}
  const fakeRequestQuery = {
    pagination: {
      limit: '10',
      page: '1',
      offset: '0',
      order: 'DESC',
      orderBy: 'id',
    },
  }
  const fakeRequest = httpRequest(
    fakeRequestBody,
    fakeRequestHeaders,
    fakeRequestParams,
    fakeRequestQuery,
  )

  const boardStub = new BoardStub()
  const sut = new BoardLoadAllItemsController({
    board: boardStub,
  })

  return {
    sut,
    fakeRequest,
    boardStub,
  }
}

describe('BoardListAllItemsController', () => {
  test('Should controller throws if getAll method throw', async () => {
    const { sut, fakeRequest, boardStub } = makeSut()

    jest.spyOn(boardStub, 'getAll').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should return invalid param error if wrong order by param is provided', async () => {
    const { sut, fakeRequest } = makeSut()
    const fakeRequestWithWrongOrderByParam = { ...fakeRequest }
    fakeRequest.query.pagination.orderBy = 'wrong-param'

    const output = sut.handle(fakeRequestWithWrongOrderByParam)

    await expect(output).rejects.toThrow(new InvalidParamError('orderBy, accepted values(createdAt,format,id,title)'))
  })

  test('Should getAll method must have been called with correct params', async () => {
    const { sut, fakeRequest, boardStub } = makeSut()

    const boardSpy = jest.spyOn(boardStub, 'getAll')

    await sut.handle(fakeRequest)

    expect(boardSpy).toHaveBeenCalledWith(fakeRequest.query.pagination)
  })

  test('Should return a board model list if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, [makeFakeBoard()]))
  })
})
