import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { ElementUpdateStub } from '@/mocks/element-update/element-update-stub'
import { ElementUpdateCreateController } from './element-update-create-controller'
import { makeFakeElementUpdate } from '@/mocks/element-update/element-update-fakes'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

const makeSut = () => {
  const { id, createdAt, updatedAt, ...body } = makeFakeElementUpdate()
  const fakeRequest = makeFakeRequest({
    body,
  })
  const elementUpdateStub = new ElementUpdateStub()
  const sut = new ElementUpdateCreateController({
    respository: elementUpdateStub,
  })

  return {
    sut,
    fakeRequest,
    elementUpdateStub,
  }
}

describe('ElementUpdateCreateController', () => {
  test('Should throw if any method of repository throws', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'create').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should return empty param error if a required param is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithoutContent = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        content: undefined,
      },
    }
    const output = sut.handle(fakeRequestWithoutContent)

    await expect(output).rejects.toThrow(new EmptyParamError('content'))
  })

  test('Should return invalid param error if a required param not have a correct type', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithWrongContent = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        content: {},
      },
    }
    const outputWithWrongContent = sut.handle(fakeRequestWithWrongContent)

    await expect(outputWithWrongContent).rejects.toThrow(new InvalidParamError('content, must have to be a string'))

    const fakeRequestWithWrongUser = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        user: 123456,
      },
    }
    const outputWithWrongUser = sut.handle(fakeRequestWithWrongUser)

    await expect(outputWithWrongUser).rejects.toThrow(new InvalidParamError('user, must have to be a string'))
  })

  test('Should call create method with correct params', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    const createSpy = jest.spyOn(elementUpdateStub, 'create')

    await sut.handle(fakeRequest)

    expect(createSpy).toHaveBeenCalledWith(fakeRequest.body)
  })

  test('Should return bad request error if create method return undefined', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'create').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Element update create fails!'))
  })

  test('Should return http response with element update model data', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, {
      message: 'Element update created!',
      data: makeFakeElementUpdate(),
    }))
  })
})
