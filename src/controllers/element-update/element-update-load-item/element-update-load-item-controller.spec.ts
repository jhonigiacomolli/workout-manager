import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { EmptyParamError, NotFoundError } from '@/helpers/errors'
import { ElementUpdateStub } from '@/mocks/element-update/element-update-stub'
import { makeFakeElementUpdate } from '@/mocks/element-update/element-update-fakes'
import { ElementUpdateLoadItemController } from './element-update-load-item-controller'

const makeSut = () => {
  const fakeRequest = makeFakeRequest()
  const elementUpdateStub = new ElementUpdateStub()
  const sut = new ElementUpdateLoadItemController({
    repository: elementUpdateStub,
  })

  return {
    sut,
    fakeRequest,
    elementUpdateStub,
  }
}

describe('ElementUpdateLoadItemController', () => {
  test('Slould return empty param error if id si not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithoutId = {
      ...fakeRequest,
      params: {},
    }

    const output = sut.handle(fakeRequestWithoutId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Slould call getById method with correct id', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    const getSpy = jest.spyOn(elementUpdateStub, 'getById')

    await sut.handle(fakeRequest)

    expect(getSpy).toHaveBeenCalledWith(fakeRequest.params.id)
  })

  test('Slould return not found error if provided id is invalid', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'getById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new NotFoundError('Element update not found!'))
  })

  test('Slould throw if getById throws', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'getById').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Slould return a http response with element update model if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, makeFakeElementUpdate()))
  })

  test('Slould return a return a element update model with correct url if have attachemts', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'getById').mockReturnValueOnce(Promise.resolve({
      ...makeFakeElementUpdate(),
      attachments: [
        '/uploads/any-image.png',
        '/uploads/other-image.png',
      ],
    }))
    const output = await sut.handle(fakeRequest)
    const { attachments, ...expected } = makeFakeElementUpdate()

    expect(output).toEqual(httpResponse(200, {
      ...expected,
      attachments: [
        fakeRequest.baseUrl + '/uploads/any-image.png',
        fakeRequest.baseUrl + '/uploads/other-image.png',
      ],
    }))
  })
})
