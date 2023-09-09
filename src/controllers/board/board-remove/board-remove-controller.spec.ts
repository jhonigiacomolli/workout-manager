import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { BoardStub } from '@/mocks/board/board-stub'
import { BoardRemoveController } from './board-remove-controller'
import { BadRequestError, EmptyParamError } from '@/helpers/errors'

const makeSut = () => {
  const fakeRequest = makeFakeRequest()
  const boardStub = new BoardStub()
  const sut = new BoardRemoveController({
    board: boardStub,
  })

  return {
    sut,
    fakeRequest,
    boardStub,
  }
}

describe('BoardRemoveController', () => {
  test('Should return empty param error if board id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    const fakeRequestWithoutId = { ...fakeRequest }
    fakeRequestWithoutId.params = {}

    const output = sut.handle(fakeRequestWithoutId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should controller calls delete method with correct id', async () => {
    const { sut, fakeRequest, boardStub } = makeSut()

    const boardSpy = jest.spyOn(boardStub, 'delete')

    await sut.handle(fakeRequest)

    expect(boardSpy).toHaveBeenCalledWith(fakeRequest.params.id)
  })

  test('Should return bad request error if delete method return false', async () => {
    const { sut, fakeRequest, boardStub } = makeSut()

    jest.spyOn(boardStub, 'delete').mockReturnValueOnce(Promise.resolve(false))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Board remove fails!'))
  })

  test('Should return 204 and success message if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(204, 'Board removed!'))
  })
})
