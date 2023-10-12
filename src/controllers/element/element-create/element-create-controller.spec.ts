import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { ElementStub } from '@/mocks/element/element-stub'
import { makeFakeElement } from '@/mocks/element/element-fakes'
import { ElementCreateController } from './element-create-controller'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

const makeSut = () => {
  const { id, createdAt, startDate, endDate, expectedDate, ...bodyParams } = makeFakeElement()
  const fakeRequest = makeFakeRequest({
    body: bodyParams,
  })
  const elementStub = new ElementStub()
  const sut = new ElementCreateController({
    element: elementStub,
  })

  return {
    sut,
    fakeRequest,
    elementStub,
  }
}

describe('ElementCreateController', () => {
  test('Should return empty param error if required fields are not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithoutTitle = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        title: '',
      },
    }
    const output = sut.handle(fakeRequestWithoutTitle)

    await expect(output).rejects.toThrow(new EmptyParamError('title'))
  })

  test('Should return invalid param error if a type of provided params are invalid', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWrongTitle = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        title: 123456,
      },
    }
    const output = sut.handle(fakeRequestWrongTitle)

    await expect(output).rejects.toThrow(new InvalidParamError('title, must have to be a string'))
  })

  test('Should calls create method with correct values', async () => {
    const { sut, fakeRequest, elementStub } = makeSut()

    const createSpy = jest.spyOn(elementStub, 'create')

    const fakeRequestWrongTitle = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        updates: undefined,
        startDate: undefined,
        endDate: undefined,
        expectedDate: undefined,
      },
    }
    await sut.handle(fakeRequestWrongTitle)

    const { id, createdAt, startDate, endDate, expectedDate, ...expected } = makeFakeElement()

    expect(createSpy).toHaveBeenCalledWith(expected)
  })

  test('Should return bad request param error if create method return undefined', async () => {
    const { sut, fakeRequest, elementStub } = makeSut()

    jest.spyOn(elementStub, 'create').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Element create fails!'))
  })

  test('Should throw if create method throws', async () => {
    const { sut, fakeRequest, elementStub } = makeSut()

    jest.spyOn(elementStub, 'create').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should return a http response with a element model data if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, {
      message: 'Element created!',
      data: makeFakeElement(),
    }))
  })
})
