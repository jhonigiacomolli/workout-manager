import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { InvalidParamError } from '@/helpers/errors'
import { ElementStub } from '@/mocks/element/element-stub'
import { makeFakeElement } from '@/mocks/element/element-fakes'
import { ElementLoadAllItemsController } from './element-load-all-items-controller'

const makeSut = () => {
  const fakeRequest = makeFakeRequest()
  const elementSub = new ElementStub()
  const sut = new ElementLoadAllItemsController({
    element: elementSub,
  })

  return {
    sut,
    fakeRequest,
    elementSub,
  }
}

describe('ElementLoadAllItemsController', () => {
  test('Should return invalid param error if a orderby provided is nota element model field', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithWrongOrderBy = {
      ...fakeRequest,
      query: {
        ...fakeRequest.query,
        pagination: {
          ...fakeRequest.query.pagination,
          orderBy: 'wrong-field',
        },
      },
    }
    const output = sut.handle(fakeRequestWithWrongOrderBy)

    await expect(output).rejects.toThrow(new InvalidParamError('orderBy, accepted values(id, createdAt, group, title, status, startData, expectedDate, endDate)'))
  })

  test('Should calls getAll method with correct params', async () => {
    const { sut, fakeRequest, elementSub } = makeSut()

    const getAllSpy = jest.spyOn(elementSub, 'getAll')

    await sut.handle(fakeRequest)

    expect(getAllSpy).toHaveBeenCalledWith(fakeRequest.query.pagination)

    const fakeRequestWithDiffPagination = makeFakeRequest({
      query: {
        pagination: {
          limit: '4',
          page: '1',
          offset: '0',
          order: 'DESC',
          orderBy: 'id',
        },
      },
    })

    await sut.handle(fakeRequestWithDiffPagination)

    expect(getAllSpy).toHaveBeenCalledWith({
      ...fakeRequest.query.pagination,
      order: 'DESC',
      orderBy: 'id',
      offset: '0',
    })
  })

  test('Should throw if getAll method throws', async () => {
    const { sut, fakeRequest, elementSub } = makeSut()

    jest.spyOn(elementSub, 'getAll').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should return a element model array if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)
    const expected = [makeFakeElement(), makeFakeElement()]

    expect(output).toEqual(httpResponse(200, expected))
  })
})
