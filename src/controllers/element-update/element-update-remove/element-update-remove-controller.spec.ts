import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { FileManagerStub } from '@/mocks/file-manager/file-manager-stub'
import { ElementUpdateStub } from '@/mocks/element-update/element-update-stub'
import { ElementUpdateRemoveController } from './element-update-remove-controller'
import { BadRequestError, EmptyParamError, NotFoundError } from '@/helpers/errors'
import { makeFakeElementUpdate } from '@/mocks/element-update/element-update-fakes'

const makeSut = () => {
  const fakeRequest = makeFakeRequest()
  const elementUpdateStub = new ElementUpdateStub()
  const fileManagerStub = new FileManagerStub()
  const sut = new ElementUpdateRemoveController({
    repository: elementUpdateStub,
    fileManager: fileManagerStub,
  })

  return {
    sut,
    fakeRequest,
    elementUpdateStub,
    fileManagerStub,
  }
}

describe('ElementUpdateRemoveController', () => {
  test('Should return empty param error if id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithoutId = {
      ...fakeRequest,
      params: {},
    }

    const output = sut.handle(fakeRequestWithoutId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should call getById with correct id', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    const getByIdSpy = jest.spyOn(elementUpdateStub, 'getById')

    await sut.handle(fakeRequest)

    expect(getByIdSpy).toHaveBeenCalledWith(fakeRequest.params.id)
  })

  test('Should return not found error if id is not element update id', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'getById').mockReturnValueOnce(Promise.resolve(undefined))

    const fakeRequestWithWrongId = {
      ...fakeRequest,
      params: { id: 'wrong' },
    }

    const output = sut.handle(fakeRequestWithWrongId)

    await expect(output).rejects.toThrow(new NotFoundError('Element update not found!'))
  })

  test('Should call removeImage method if element update have attachments', async () => {
    const { sut, fakeRequest, elementUpdateStub, fileManagerStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'getById').mockReturnValueOnce(Promise.resolve({
      ...makeFakeElementUpdate(),
      attachments: [
        '/uploads/any-image.png',
        '/uploads/other-image.png',
      ],
    }))

    const removeImageSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequest)

    expect(removeImageSpy).toHaveBeenCalledWith('/uploads/any-image.png')
    expect(removeImageSpy).toHaveBeenCalledWith('/uploads/other-image.png')
    expect(removeImageSpy).toHaveBeenCalledTimes(2)
  })

  test('Should do not call removeImage method if element update not have attachments', async () => {
    const { sut, fakeRequest, fileManagerStub } = makeSut()

    const removeImageSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequest)

    expect(removeImageSpy).toHaveBeenCalledTimes(0)
  })

  test('Should call delete method if correct id', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    const removeImageSpy = jest.spyOn(elementUpdateStub, 'delete')

    await sut.handle(fakeRequest)

    expect(removeImageSpy).toHaveBeenCalledWith(fakeRequest.params.id)
  })

  test('Should return bad request error if delete method return false', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'delete').mockReturnValueOnce(Promise.resolve(false))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Element update remove fails!'))
  })

  test('Should return a http respose with 204 if proccess succeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(204, 'Element update removed!'))
  })
})
