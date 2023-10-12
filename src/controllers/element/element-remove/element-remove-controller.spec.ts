import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { ElementStub } from '@/mocks/element/element-stub'
import { ElementRemoveController } from './element-remove-controller'
import { BadRequestError, EmptyParamError, NotFoundError } from '@/helpers/errors'

const makeSut = () => {
  const fakeRequest = makeFakeRequest()
  const elementStub = new ElementStub()
  const sut = new ElementRemoveController({
    element: elementStub,
  })

  return {
    sut,
    fakeRequest,
    elementStub,
  }
}

describe('ElementRemoveController', () => {
  test('Should return empty param error if id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithoutId = {
      ...fakeRequest,
      params: {},
    }

    const output = sut.handle(fakeRequestWithoutId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should call getById with correct value', async () => {
    const { sut, fakeRequest, elementStub } = makeSut()

    const getByIdSpy = jest.spyOn(elementStub, 'getById')

    await sut.handle(fakeRequest)

    expect(getByIdSpy).toHaveBeenCalledWith(fakeRequest.params.id)
    expect(getByIdSpy).toHaveBeenCalledTimes(1)
  })

  test('Should return not found error if id is invalid', async () => {
    const { sut, fakeRequest, elementStub } = makeSut()

    jest.spyOn(elementStub, 'getById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new NotFoundError('Element not found!'))
  })

  test('Should call delete method with correct value', async () => {
    const { sut, fakeRequest, elementStub } = makeSut()

    const deleteSpy = jest.spyOn(elementStub, 'delete')

    await sut.handle(fakeRequest)

    expect(deleteSpy).toHaveBeenCalledWith(fakeRequest.params.id)
    expect(deleteSpy).toHaveBeenCalledTimes(1)
  })

  test('Should return bad request error if delete return false', async () => {
    const { sut, fakeRequest, elementStub } = makeSut()

    jest.spyOn(elementStub, 'delete').mockReturnValueOnce(Promise.resolve(false))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Element remove fails!'))
  })

  test('Should return 204 if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(204, 'Element removed!'))
  })
})
