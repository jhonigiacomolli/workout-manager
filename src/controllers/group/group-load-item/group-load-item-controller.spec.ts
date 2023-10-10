import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { GropuStub } from '@/mocks/group/group-stub'
import { makeFakeGroup } from '@/mocks/group/group-fakes'
import { EmptyParamError, NotFoundError } from '@/helpers/errors'
import { GroupLoadItemController } from './group-load-item-controller'

const makeSut = () => {
  const fakeRequest = makeFakeRequest({
    params: {
      id: 'any_id',
    },
  })

  const groupStub = new GropuStub()
  const sut = new GroupLoadItemController({
    group: groupStub,
  })

  return {
    sut,
    fakeRequest,
    groupStub,
  }
}

describe('GroupLoadItemController', () => {
  test('Should return empty param error if id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithoutId = {
      ...fakeRequest,
      params: {},
    }

    const output = sut.handle(fakeRequestWithoutId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should calls getById method with correct value', async () => {
    const { sut, fakeRequest, groupStub } = makeSut()

    const requestSpy = jest.spyOn(groupStub, 'getById')

    await sut.handle(fakeRequest)

    expect(requestSpy).toHaveBeenCalledWith(fakeRequest.params.id)
  })

  test('Should return not found param error if id is not a group id', async () => {
    const { sut, fakeRequest, groupStub } = makeSut()

    jest.spyOn(groupStub, 'getById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new NotFoundError('Group not found!'))
  })

  test('Should return a group model if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, makeFakeGroup()))
  })
})
