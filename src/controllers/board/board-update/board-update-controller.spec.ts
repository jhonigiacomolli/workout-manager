import { httpRequest, httpResponse } from '@/helpers/http'
import { BoardStub } from '@/mocks/board/board-stub'
import { BoardUpdateController } from './board-update-controller'
import { makeFakeBoard } from '@/mocks/board/board-fakes'
import { EmptyParamError, InvalidParamError, NotFoundError } from '@/helpers/errors'

const makeSut = () => {
  const { id, ...fakeRequestBody } = makeFakeBoard()
  const fakeRequestHeaders = {}
  const fakeRequestParams = {
    id,
  }
  const fakeRequest = httpRequest(
    fakeRequestBody,
    fakeRequestHeaders,
    fakeRequestParams,
  )
  const boardStub = new BoardStub()
  const sut = new BoardUpdateController({
    board: boardStub,
  })

  return {
    sut,
    fakeRequest,
    boardStub,
  }
}

describe('BoardUpdateController', () => {
  test('Should return empty param error if id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    const fakeRequestWIthoutId = { ...fakeRequest }
    fakeRequestWIthoutId.params = {}

    const output = sut.handle(fakeRequestWIthoutId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should return invalid param error a type of body field provided is wrong', async () => {
    const { sut, fakeRequest } = makeSut()
    const fakeRequestWIthoutId = { ...fakeRequest }
    fakeRequestWIthoutId.body = {
      ...fakeRequest.body,
      title: true,
    }

    await expect(sut.handle(fakeRequestWIthoutId)).rejects.toThrow(new InvalidParamError('title must have to be a string'))

    fakeRequestWIthoutId.body = {
      ...fakeRequest.body,
      title: 'any-title',
      groups: 'any-group',
    }

    await expect(sut.handle(fakeRequestWIthoutId)).rejects.toThrow(new InvalidParamError('groups must have to be a array'))
  })

  test('Should should calls setById method with correct values', async () => {
    const { sut, fakeRequest, boardStub } = makeSut()

    const boardSpy = jest.spyOn(boardStub, 'setById')

    await sut.handle(fakeRequest)

    expect(boardSpy).toHaveBeenCalledWith(fakeRequest.params.id, fakeRequest.body)

    const fakeRequestWithoudGroups = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        groups: undefined,
      },
    }

    await sut.handle(fakeRequestWithoudGroups)

    expect(boardSpy).toHaveBeenCalledWith(fakeRequest.params.id, fakeRequestWithoudGroups.body)
  })

  test('Should controller throws if setById method throw', async () => {
    const { sut, fakeRequest, boardStub } = makeSut()

    jest.spyOn(boardStub, 'setById').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should return not found error if setById returns undefined', async () => {
    const { sut, fakeRequest, boardStub } = makeSut()

    jest.spyOn(boardStub, 'setById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new NotFoundError('Board not found!'))
  })

  test('Should return a message and board model if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, {
      message: 'Board update successfully!',
      data: makeFakeBoard(),
    }))
  })
})
