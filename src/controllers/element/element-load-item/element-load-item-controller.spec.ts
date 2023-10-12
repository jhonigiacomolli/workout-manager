import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { ElementStub } from '@/mocks/element/element-stub'
import { makeFakeElement } from '@/mocks/element/element-fakes'
import { EmptyParamError, NotFoundError } from '@/helpers/errors'
import { ElementLoadItemController } from './element-load-item-controller'

const makeSut = () => {
  const { id } = makeFakeElement()
  const fakeRequest = makeFakeRequest({
    params: { id },
  })
  const elementStub = new ElementStub()
  const sut = new ElementLoadItemController({
    element: elementStub,
  })

  return {
    sut,
    fakeRequest,
    elementStub,
  }
}

describe('ElementLoadItemController', () => {
  test('Should return empty param error if id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithoutId = {
      ...fakeRequest,
      params: {},
    }

    const output = sut.handle(fakeRequestWithoutId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should call getById method with correct value', async () => {
    const { sut, fakeRequest, elementStub } = makeSut()

    const getElementSpy = jest.spyOn(elementStub, 'getById')

    await sut.handle(fakeRequest)

    expect(getElementSpy).toHaveBeenCalledWith(fakeRequest.params.id)
  })

  test('Should return not found error if provided id is invalid', async () => {
    const { sut, fakeRequest, elementStub } = makeSut()

    jest.spyOn(elementStub, 'getById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new NotFoundError('Element not found!'))
  })

  test('Should return a element model if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, makeFakeElement()))
  })
})
