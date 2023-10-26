import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { FileManagerStub } from '@/mocks/file-manager/file-manager-stub'
import { ElementUpdateStub } from '@/mocks/element-update/element-update-stub'
import { ElementUpdateCreateController } from './element-update-create-controller'
import { makeFakeElementUpdate } from '@/mocks/element-update/element-update-fakes'
import { BadRequestError, EmptyParamError, InvalidParamError, NotFoundError } from '@/helpers/errors'
import { ElementStub } from '@/mocks/element/element-stub'

const makeSut = () => {
  const { id, createdAt, updatedAt, ...body } = makeFakeElementUpdate()
  const fakeRequest = makeFakeRequest({
    body,
    files: {
      attachments: [
        {
          filename: 'any-filename',
          mime: 'image/png',
          extension: '.png',
          data: 'any-image-data',
        },
        {
          filename: 'other-filename',
          mime: 'image/png',
          extension: '.png',
          data: 'other-image-data',
        },
      ],
    },
  })
  const elementUpdateStub = new ElementUpdateStub()
  const elementStub = new ElementStub()
  const fileManagerStub = new FileManagerStub()
  const sut = new ElementUpdateCreateController({
    respository: elementUpdateStub,
    element: elementStub,
    fileManager: fileManagerStub,
  })

  return {
    sut,
    fakeRequest,
    elementUpdateStub,
    elementStub,
    fileManagerStub,
  }
}

describe('ElementUpdateCreateController', () => {
  test('Should throw if any method of repository throws', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'create').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should return empty param error if a required param is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithoutContent = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        content: undefined,
      },
    }
    const output = sut.handle(fakeRequestWithoutContent)

    await expect(output).rejects.toThrow(new EmptyParamError('content'))
  })

  test('Should return invalid param error if a required param not have a correct type', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithWrongContent = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        content: {},
      },
    }
    const outputWithWrongContent = sut.handle(fakeRequestWithWrongContent)

    await expect(outputWithWrongContent).rejects.toThrow(new InvalidParamError('content, must have to be a string'))

    const fakeRequestWithWrongUser = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        user: 123456,
      },
    }
    const outputWithWrongUser = sut.handle(fakeRequestWithWrongUser)

    await expect(outputWithWrongUser).rejects.toThrow(new InvalidParamError('user, must have to be a string'))
  })

  test('Should call element getById method with correct element id', async () => {
    const { sut, fakeRequest, elementStub } = makeSut()

    const elementGetByIdSpy = jest.spyOn(elementStub, 'getById')

    await sut.handle(fakeRequest)

    expect(elementGetByIdSpy).toHaveBeenCalledWith(fakeRequest.body.elementId)
  })

  test('Should return not found error if elementId is not a valid element id', async () => {
    const { sut, fakeRequest, elementStub } = makeSut()

    jest.spyOn(elementStub, 'getById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new NotFoundError('Element not found!'))
  })

  test('Should return invalid param error if attachments provided is not an array', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithWrongAttachments = {
      ...fakeRequest,
      files: {
        attachments: {},
      },
    }

    const output = sut.handle(fakeRequestWithWrongAttachments)

    await expect(output).rejects.toThrow(new InvalidParamError('attachments, must have to be a array of files!'))
  })

  test('Should call upload file method if have attachments', async () => {
    const { sut, fakeRequest, fileManagerStub } = makeSut()

    const uploadeImageSpy = jest.spyOn(fileManagerStub, 'uploadImage')

    await sut.handle(fakeRequest)

    expect(uploadeImageSpy).toHaveBeenCalledWith(fakeRequest.files.attachments[0])
    expect(uploadeImageSpy).toHaveBeenCalledWith(fakeRequest.files.attachments[1])
    expect(uploadeImageSpy).toHaveBeenCalledTimes(2)
  })

  test('Should return bad request error if uploadImage method return null', async () => {
    const { sut, fakeRequest, fileManagerStub } = makeSut()

    jest.spyOn(fileManagerStub, 'uploadImage').mockReturnValueOnce(Promise.resolve(null))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Upload attachment fails!'))
  })

  test('Should call create method with correct params', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    const createSpy = jest.spyOn(elementUpdateStub, 'create')

    await sut.handle(fakeRequest)

    expect(createSpy).toHaveBeenCalledWith({
      ...fakeRequest.body,
      attachments: [
        '/uploads/any-file-uploaded.png',
        '/uploads/any-file-uploaded.png',
      ],
    })
  })

  test('Should return bad request error if create method return undefined', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'create').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Element update create fails!'))
  })

  test('Should return http response with element update model data', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'create').mockReturnValueOnce(Promise.resolve({
      ...makeFakeElementUpdate(),
      attachments: [
        '/uploads/any-file-uploaded.png',
        '/uploads/any-file-uploaded.png',
      ],
    }))

    const output = await sut.handle(fakeRequest)
    const expected = {
      ...makeFakeElementUpdate(),
      attachments: [
        fakeRequest.baseUrl + '/uploads/any-file-uploaded.png',
        fakeRequest.baseUrl + '/uploads/any-file-uploaded.png',
      ],
    }
    expect(output).toEqual(httpResponse(200, {
      message: 'Element update created!',
      data: expected,
    }))
  })
})
