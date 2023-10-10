import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { GropuStub } from '@/mocks/group/group-stub'
import { makeFakeGroup } from '@/mocks/group/group-fakes'
import { GroupRemoveController } from './group-remove-controller'
import { BadRequestError, EmptyParamError } from '@/helpers/errors'

const makeSut = () => {
  const { id } = makeFakeGroup()
  const fakeRequest = makeFakeRequest({
    params: { id },
  })

  const groupStub = new GropuStub()
  const sut = new GroupRemoveController({
    group: groupStub,
  })

  return {
    sut,
    fakeRequest,
    groupStub,
  }
}

describe('GroupRemoveController', () => {
  test('Should return empty param error if is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithoutId = {
      ...fakeRequest,
      params: {},
    }

    const output = sut.handle(fakeRequestWithoutId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should call delete method with correct value', async () => {
    const { sut, fakeRequest, groupStub } = makeSut()

    const deleteSpy = jest.spyOn(groupStub, 'delete')

    await sut.handle(fakeRequest)

    expect(deleteSpy).toHaveBeenCalledWith(fakeRequest.params.id)
  })

  test('Should return bad request error if delete method return false', async () => {
    const { sut, fakeRequest, groupStub } = makeSut()

    jest.spyOn(groupStub, 'delete').mockReturnValueOnce(Promise.resolve(false))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Group remove fails!'))
  })

  test('Should 204 if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(204, 'Group removed!'))
  })
})
