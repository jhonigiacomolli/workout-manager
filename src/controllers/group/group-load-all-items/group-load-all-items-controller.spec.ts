import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { GropuStub } from '@/mocks/group/group-stub'
import { InvalidParamError } from '@/helpers/errors'
import { makeFakeGroup } from '@/mocks/group/group-fakes'
import { GroupLoadAllItemsController } from './group-load-all-items-controller'

const makeSut = () => {
  const fakeRequest = makeFakeRequest()

  const groupStub = new GropuStub()
  const sut = new GroupLoadAllItemsController({
    group: groupStub,
  })

  return {
    sut,
    fakeRequest,
    groupStub,
  }
}

describe('GroupLoadAllItemsController', () => {
  test('Should return invalid param error if wrong orderBy param is provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithoutId = {
      ...fakeRequest,
      query: {
        ...fakeRequest.query,
        pagination: {
          ...fakeRequest.params.pagination,
          orderBy: 'other-field',
        },
      },
    }

    const output = sut.handle(fakeRequestWithoutId)

    await expect(output).rejects.toThrow(new InvalidParamError('orderBy, accepted values(id, createdAt, title, elements)'))
  })

  test('Should calls getAll with correct values', async () => {
    const { sut, fakeRequest, groupStub } = makeSut()

    const getAllSpy = jest.spyOn(groupStub, 'getAll')

    await sut.handle(fakeRequest)

    expect(getAllSpy).toHaveBeenCalledWith(fakeRequest.query.pagination)
  })

  test('Should throw if getAll method throws', async () => {
    const { sut, fakeRequest, groupStub } = makeSut()

    jest.spyOn(groupStub, 'getAll').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should return a list of group model if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, [makeFakeGroup()]))
  })
})
