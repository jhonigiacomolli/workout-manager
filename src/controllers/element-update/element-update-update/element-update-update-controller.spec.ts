import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { FileManagerStub } from '@/mocks/file-manager/file-manager-stub'
import { ElementUpdateStub } from '@/mocks/element-update/element-update-stub'
import { ElementUpdateUpdateController } from './element-update-update-controller'
import { makeFakeElementUpdate } from '@/mocks/element-update/element-update-fakes'
import { BadRequestError, EmptyParamError, InvalidParamError, NotFoundError } from '@/helpers/errors'

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
          mime: 'image/jpg',
          extension: '.jpg',
          data: 'other-image-data',
        },
      ],
    },
  })
  const elementUpdateStub = new ElementUpdateStub()
  const fileManagerStub = new FileManagerStub()
  const sut = new ElementUpdateUpdateController({
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

describe('ElementUpdateUpdateController', () => {
  test('Should return empty param error if id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithouId = {
      ...fakeRequest,
      params: {},
    }

    const output = sut.handle(fakeRequestWithouId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should call getById with correct id', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    const getByIdSpy = jest.spyOn(elementUpdateStub, 'getById')

    await sut.handle(fakeRequest)

    expect(getByIdSpy).toHaveBeenCalledWith(fakeRequest.params.id)
    expect(getByIdSpy).toHaveBeenCalledTimes(1)
  })

  test('Should return not found error if provided id is not a element update id', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'getById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new NotFoundError('Element update not found!'))
  })

  test('Should return invalid param error if content params have wrong type', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithWrongContent = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        content: {},
      },
    }

    const output = sut.handle(fakeRequestWithWrongContent)

    await expect(output).rejects.toThrow(new InvalidParamError('content, must have to be a string'))
  })

  test('Should return invalid param error if user params have wrong type', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithWrongUser = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        user: [],
      },
    }

    const output = sut.handle(fakeRequestWithWrongUser)

    await expect(output).rejects.toThrow(new InvalidParamError('user, must have to be a string'))
  })

  test('Should remove saved attachment if do not in list of attachments provided params', async () => {
    const { sut, fakeRequest, elementUpdateStub, fileManagerStub } = makeSut()

    const fakeRequestWithAttachments = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        attachments: [
          fakeRequest.baseUrl + '/uploads/old-image.png',
        ],
      },
    }

    const removeImageSpy = jest.spyOn(fileManagerStub, 'removeImage')

    jest.spyOn(elementUpdateStub, 'getById').mockReturnValueOnce(Promise.resolve({
      ...makeFakeElementUpdate(),
      attachments: [
        fakeRequest.baseUrl + '/uploads/cleared-image.png',
        fakeRequest.baseUrl + '/uploads/old-image.png',
      ],
    }))

    await sut.handle(fakeRequestWithAttachments)

    expect(removeImageSpy).toHaveBeenCalledWith('/uploads/cleared-image.png')
  })

  test('Should removeImage method do not to be called if attachments is undefined', async () => {
    const { sut, fakeRequest, fileManagerStub } = makeSut()

    const removeImageSpy = jest.spyOn(fileManagerStub, 'removeImage')

    const fakeRequestWithoutAttachements = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        attachments: undefined,
      },
    }

    await sut.handle(fakeRequestWithoutAttachements)

    expect(removeImageSpy).not.toHaveBeenCalled()
  })

  test('Should call uploadImage with attachments if there are provided', async () => {
    const { sut, fakeRequest, fileManagerStub } = makeSut()

    const updloadImageSpy = jest.spyOn(fileManagerStub, 'uploadImage')

    await sut.handle(fakeRequest)

    expect(updloadImageSpy).toHaveBeenCalledWith(fakeRequest.files.attachments[0])
    expect(updloadImageSpy).toHaveBeenCalledWith(fakeRequest.files.attachments[1])
    expect(updloadImageSpy).toHaveBeenCalledTimes(2)
  })

  test('Should do not call uploadImage with attachments if there are provided but not is a array', async () => {
    const { sut, fakeRequest, fileManagerStub } = makeSut()

    const updloadImageSpy = jest.spyOn(fileManagerStub, 'uploadImage')

    const fakeRequestWithWrongAttachemntsFiles = {
      ...fakeRequest,
      files: {
        ...fakeRequest.files,
        attachments: {},
      },
    }
    await sut.handle(fakeRequestWithWrongAttachemntsFiles)

    expect(updloadImageSpy).toHaveBeenCalledTimes(0)
  })

  test('Should return bad request error if uploadImage return null', async () => {
    const { sut, fakeRequest, fileManagerStub } = makeSut()

    jest.spyOn(fileManagerStub, 'uploadImage').mockReturnValueOnce(Promise.resolve(null))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Upload attachment fails!'))
  })

  test('Should call setById correct values', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    const setByIdSpy = jest.spyOn(elementUpdateStub, 'setById')

    const fakeRequestWithOldAttachemnts = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        attachments: [
          fakeRequest.baseUrl + '/uploads/saved-image.png',
        ],
      },
    }
    await sut.handle(fakeRequestWithOldAttachemnts)

    const { elementId, ...params } = fakeRequestWithOldAttachemnts.body
    expect(setByIdSpy).toHaveBeenCalledWith(fakeRequestWithOldAttachemnts.params.id, {
      ...params,
      attachments: [
        ...params.attachments,
        '/uploads/any-file-uploaded.png',
        '/uploads/any-file-uploaded.png',
      ],
    })
  })

  test('Should return bad request error if setById return undefined', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'setById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Element update fails!'))
  })

  test('Should return a http response with a element update model if proccess succeeds', async () => {
    const { sut, fakeRequest, elementUpdateStub } = makeSut()

    jest.spyOn(elementUpdateStub, 'setById').mockReturnValueOnce(Promise.resolve({
      ...makeFakeElementUpdate(),
      attachments: [
        '/uploads/saved-image.png',
        '/uploads/any-file-uploaded.png',
        '/uploads/any-file-uploaded.png',
      ],
    }))

    const fakeRequestWithOldAttachemnts = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        attachments: [
          fakeRequest.baseUrl + '/uploads/saved-image.png',
        ],
      },
    }

    const output = await sut.handle(fakeRequestWithOldAttachemnts)

    expect(output).toEqual(httpResponse(200, {
      message: 'Element update succeeds!',
      data: {
        ...makeFakeElementUpdate(),
        attachments: [
          fakeRequest.baseUrl + '/uploads/saved-image.png',
          fakeRequest.baseUrl + '/uploads/any-file-uploaded.png',
          fakeRequest.baseUrl + '/uploads/any-file-uploaded.png',
        ],
      },
    }))
  })
})
