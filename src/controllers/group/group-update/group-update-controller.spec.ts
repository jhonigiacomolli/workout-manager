import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { GropuStub } from '@/mocks/group/group-stub'
import { makeFakeGroup } from '@/mocks/group/group-fakes'
import { GroupUpdateController } from './group-update-controller'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

const makeSut = () => {
  const { id, ...body } = makeFakeGroup()
  const fakeRequest = makeFakeRequest({
    params: {
      id: 'any_id',
    },
    body,
  })

  const groupStub = new GropuStub()
  const sut = new GroupUpdateController({
    group: groupStub,
  })

  return {
    sut,
    fakeRequest,
    groupStub,
  }
}

describe('GroupUpdateController', () => {
  test('Should return empty param error if id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithoutId = {
      ...fakeRequest,
      params: {},
    }

    const output = sut.handle(fakeRequestWithoutId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should return invalid param error if id is invalid', async () => {
    const { sut, fakeRequest, groupStub } = makeSut()

    jest.spyOn(groupStub, 'getById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new InvalidParamError('id'))
  })

  test('Should return invalid param error if title is provided but not to be a string', async () => {
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
  })

  test('Should return invalid param error if elements is provided but not to be a array', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithWrongElements = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        elements: {},
      },
    }

    const output = sut.handle(fakeRequestWithWrongElements)

    await expect(output).rejects.toThrow(new InvalidParamError('elements, must have to be a array'))
  })

  test('Should call update method only with model params', async () => {
    const { sut, fakeRequest, groupStub } = makeSut()

    const updateSpy = jest.spyOn(groupStub, 'setById')

    const fakeRequestWithExtraFields = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        wrongField: 'with-wrong-value',
      },
    }

    await sut.handle(fakeRequestWithExtraFields)

    expect(updateSpy).toHaveBeenCalledWith(fakeRequestWithExtraFields.params.id, {
      title: fakeRequestWithExtraFields.body.title,
      elements: fakeRequestWithExtraFields.body.elements,
    })
  })

  test('Should return bad request param error if setById return undefined', async () => {
    const { sut, fakeRequest, groupStub } = makeSut()

    jest.spyOn(groupStub, 'setById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Group update fails!'))
  })

  test('Should return a group model if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, {
      message: 'Group updated!',
      data: makeFakeGroup(),
    }))
  })
})
