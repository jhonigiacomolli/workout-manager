import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { BoardStub } from '@/mocks/board/board-stub'
import { InvalidParamError } from '@/helpers/errors'
import { makeFakeBoard } from '@/mocks/board/board-fakes'
import { BoardLoadAllItemsController } from './board-load-all-items-controller'

const makeSut = () => {
  const fakeRequest = makeFakeRequest()
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
    const fakeRequestWithWrongOrderByParam = makeFakeRequest({
      query: {
        pagination: {
          ...fakeRequest.query.pagination,
          orderBy: 'wrong-field',
        },
      },
    })

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
