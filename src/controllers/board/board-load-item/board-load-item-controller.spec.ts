import { BoardStub } from '@/mocks/board/board-stub'
import { makeFakeBoard } from '@/mocks/board/board-fakes'
import { httpRequest, httpResponse } from '@/helpers/http'
import { EmptyParamError, NotFoundError } from '@/helpers/errors'
import { BoardLoadItemController } from './board-load-item-controller'

const makeSut = () => {
  const fakeRequestBody = {}
  const fakeRequestHeaders = {}
  const fakeRequestParams = {
    id: 'any_id',
  }
  const fakeRequest = httpRequest(
    fakeRequestBody,
    fakeRequestHeaders,
    fakeRequestParams,
  )
  const boardStub = new BoardStub()
  const sut = new BoardLoadItemController({
    board: boardStub,
  })

  return {
    sut,
    fakeRequest,
    boardStub,
  }
}

describe('BoardLoadItemController', () => {
  test('Should return empty param error if id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithoutId = { ...fakeRequest }
    fakeRequestWithoutId.params = {}

    const output = sut.handle(fakeRequestWithoutId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should return not found error if provided id is invalid', async () => {
    const { sut, fakeRequest, boardStub } = makeSut()

    jest.spyOn(boardStub, 'getById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new NotFoundError('Board not found!'))
  })

  test('Should calls getById with correct value', async () => {
    const { sut, fakeRequest, boardStub } = makeSut()

    const boardSpy = jest.spyOn(boardStub, 'getById')

    await sut.handle(fakeRequest)

    expect(boardSpy).toHaveBeenCalledWith(fakeRequest.params.id)
  })

  test('Should return a board model if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, makeFakeBoard()))
  })
})
