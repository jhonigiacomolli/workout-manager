import { BoardStub } from '@/mocks/board/board-stub'
import { makeFakeBoard } from '@/mocks/board/board-fakes'
import { httpRequest, httpResponse } from '@/helpers/http'
import { BoardCreateController } from './board-create-controller'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

const makeSut = () => {
  const { id, ...params } = makeFakeBoard()
  const fakeRequestBody = params
  const fakeRequestHeaders = {}
  const fakeRequest = httpRequest(fakeRequestBody, fakeRequestHeaders)
  const boardStub = new BoardStub()
  const sut = new BoardCreateController({
    board: boardStub,
  })

  return {
    sut,
    fakeRequest,
    boardStub,
  }
}

describe('BoardCreateController', () => {
  test('Should return empty param error if no body found', async () => {
    const { sut, fakeRequest } = makeSut()
    const fakeRequestWithoutBody = { ...fakeRequest }
    fakeRequestWithoutBody.body = {}

    await expect(sut.handle(fakeRequestWithoutBody)).rejects.toThrow(new EmptyParamError('title'))

    fakeRequestWithoutBody.body.title = 'any_title'

    await expect(sut.handle(fakeRequestWithoutBody)).rejects.toThrow(new EmptyParamError('format'))
  })

  test('Should return invalid param error if any provided param have wrong type', async () => {
    const { sut, fakeRequest } = makeSut()
    const fakeRequestWithWrongParams = { ...fakeRequest }
    fakeRequestWithWrongParams.body.title = 125

    await expect(sut.handle(fakeRequestWithWrongParams)).rejects.toThrow(new InvalidParamError('title must to be a string'))
  })

  test('Should return invalid param error if format param have a wrong value', async () => {
    const { sut, fakeRequest } = makeSut()
    const fakeRequestWithWrongParams = { ...fakeRequest }
    fakeRequestWithWrongParams.body.format = 'wrong-format'

    const output = sut.handle(fakeRequestWithWrongParams)

    await expect(output).rejects.toThrow(new InvalidParamError('format, accepted values(kanban,gant,table)'))
  })

  test('Should thorws if any method throws', async () => {
    const { sut, fakeRequest, boardStub } = makeSut()

    jest.spyOn(boardStub, 'create').mockImplementationOnce(() => {
      throw new Error('')
    })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should controller calls create method with correct params', async () => {
    const { sut, fakeRequest, boardStub } = makeSut()

    const boardSpy = jest.spyOn(boardStub, 'create')

    await sut.handle(fakeRequest)

    expect(boardSpy).toHaveBeenCalledWith(fakeRequest.body)
  })

  test('Should return bad request error if create method do not return a board model', async () => {
    const { sut, fakeRequest, boardStub } = makeSut()

    jest.spyOn(boardStub, 'create').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Board creation fails!'))
  })

  test('Should return a board model if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, {
      message: 'Successfully registered board',
      data: makeFakeBoard(),
    }))
  })
})
