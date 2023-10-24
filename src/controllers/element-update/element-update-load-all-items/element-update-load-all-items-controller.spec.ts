import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { InvalidParamError } from '@/helpers/errors'
import { ElementUpdateStub } from '@/mocks/element-update/element-update-stub'
import { makeFakeElementUpdate } from '@/mocks/element-update/element-update-fakes'
import { ElementUpdateLoadAllItemsController } from './element-update-load-all-items-controller'

const makeSut = () => {
  const fakRequest = makeFakeRequest()
  const elementUpdateStub = new ElementUpdateStub()
  const sut = new ElementUpdateLoadAllItemsController({
    repository: elementUpdateStub,
  })

  return {
    sut,
    fakRequest,
    elementUpdateStub,
  }
}

describe('ElementUpdateLoadAllItemsController', () => {
  test('Should return invalid param error if orderby field is invalid', async () => {
    const { sut, fakRequest } = makeSut()

    const fakRequestWithWrongOrderByField = {
      ...fakRequest,
      query: {
        ...fakRequest.query,
        pagination: {
          ...fakRequest.query.pagination,
          orderBy: 'wrong',
        },
      },
    }

    const output = sut.handle(fakRequestWithWrongOrderByField)

    await expect(output).rejects.toThrow(new InvalidParamError('orderBy, accepted values(id, createdAt, user, updatedAt, content)'))
  })

  test('Should call getAll method with correct params', async () => {
    const { sut, fakRequest, elementUpdateStub } = makeSut()

    const getAllSpy = jest.spyOn(elementUpdateStub, 'getAll')

    await sut.handle(fakRequest)

    expect(getAllSpy).toHaveBeenCalledWith(fakRequest.query.pagination)
  })

  test('Should throw if getAll method throws', async () => {
    const { sut, fakRequest, elementUpdateStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'getAll').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should return a http response with element update model list if proccess succeeds', async () => {
    const { sut, fakRequest } = makeSut()

    const output = await sut.handle(fakRequest)

    expect(output).toEqual(httpResponse(200, [makeFakeElementUpdate()]))
  })
})
