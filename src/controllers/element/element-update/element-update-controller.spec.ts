import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { ElementStub } from '@/mocks/element/element-stub'
import { makeFakeElement } from '@/mocks/element/element-fakes'
import { ElementUpdateController } from './element-update-controller'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

const makeSut = () => {
  const { id, createdAt, ...bodyParams } = makeFakeElement()
  const fakeRequest = makeFakeRequest({
    params: { id },
    body: bodyParams,
  })
  const elementStub = new ElementStub()
  const sut = new ElementUpdateController({
    element: elementStub,
  })

  return {
    sut,
    fakeRequest,
    elementStub,
  }
}

describe('ElementUpdateController', () => {
  test('Should return empty param error if id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithouId = {
      ...fakeRequest,
      params: {},
    }

    const output = sut.handle(fakeRequestWithouId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should return invalid param error if any provided params have th wrong type', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithWrongTitle = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        title: 123456,
      },
    }

    const output = sut.handle(fakeRequestWithWrongTitle)

    await expect(output).rejects.toThrow(new InvalidParamError('title, must have to be a string'))

    const fakeRequestWithWrongMembers = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        members: {},
      },
    }

    const outputWithWrongMembets = sut.handle(fakeRequestWithWrongMembers)

    await expect(outputWithWrongMembets).rejects.toThrow(new InvalidParamError('members, must have to be a array'))
  })

  test('Should calls update method with correct values', async () => {
    const { sut, elementStub } = makeSut()

    const updateSpy = jest.spyOn(elementStub, 'setById')

    const { id, createdAt, members, expectedDate, endDate, ...bodyParams } = makeFakeElement()
    const fakeRequest = makeFakeRequest({
      body: {
        ...bodyParams,
        other: 'other-param',
        wrong: 'wrong-param',
      },
      params: { id },
    })

    await sut.handle(fakeRequest)

    expect(updateSpy).toHaveBeenCalledWith(id, bodyParams)
  })

  test('Should return bad request error if update method return undefined', async () => {
    const { sut, fakeRequest, elementStub } = makeSut()

    jest.spyOn(elementStub, 'setById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Element update fails!'))
  })

  test('Should return a http response with a element model data', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, {
      message: 'Element updated!',
      data: makeFakeElement(),
    }))
  })
})
