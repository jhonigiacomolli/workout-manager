import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { GropuStub } from '@/mocks/group/group-stub'
import { makeFakeGroup } from '@/mocks/group/group-fakes'
import { GroupCreateController } from './group-create-controller'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

const makeSut = () => {
  const { id, ...body } = makeFakeGroup()
  const fakeRequest = makeFakeRequest({
    params: {},
    body,
  })

  const groupStub = new GropuStub()
  const sut = new GroupCreateController({
    group: groupStub,
  })

  return {
    sut,
    fakeRequest,
    groupStub,
  }
}

describe('GroupCreateController', () => {
  test('Should return invalid param error if title do not to be a string', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithoutTitle = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        title: 123,
      },
    }
    const output = sut.handle(fakeRequestWithoutTitle)

    await expect(output).rejects.toThrow(new InvalidParamError('title, must have to be a string'))
  })

  test('Should return invalid param error if elements do not be a array', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithoutTitle = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        elements: {},
      },
    }
    const output = sut.handle(fakeRequestWithoutTitle)

    await expect(output).rejects.toThrow(new InvalidParamError('elements, must have to be a array'))
  })

  test('Should return empty param error if any required param is not provided', async () => {
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

  test('Should throw if create method throws', async () => {
    const { sut, fakeRequest, groupStub } = makeSut()

    jest.spyOn(groupStub, 'create').mockImplementationOnce(() => {
      throw new Error(' ')
    })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should calls create method if correct params', async () => {
    const { sut, fakeRequest, groupStub } = makeSut()

    const createSpy = jest.spyOn(groupStub, 'create')

    await sut.handle(fakeRequest)

    expect(createSpy).toHaveBeenCalledWith({
      title: fakeRequest.body.title,
      elements: fakeRequest.body.elements,
    })
  })

  test('Should return bad request error if create method return undefined', async () => {
    const { sut, fakeRequest, groupStub } = makeSut()

    jest.spyOn(groupStub, 'create').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Group create method fails!'))
  })

  test('Should return a http response with status code 200 and data to be a group model', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, {
      message: 'Group created successfully!',
      data: makeFakeGroup(),
    }))
  })
})
