import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { WorkspaceStub } from '@/mocks/workspace/wokrspace-stub'
import { makeFakeWorkspace } from '@/mocks/workspace/workspace-fakes'
import { FileManagerStub } from '@/mocks/file-manager/file-manager-stub'
import { WorkspaceUpdateController } from './workspace-update-controller'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

const makeSut = () => {
  const { id, createdAt, ...body } = makeFakeWorkspace()
  const fakeRequest = makeFakeRequest({
    body,
    params: { id },
  })
  const { coverImage, profileImage, ...bodyWithoutImages } = body
  const coverImageFile = {
    filename: 'any-cover-filename.pgn',
    mime: 'image/png',
    extension: 'png',
    data: 'only-image-data',
  }
  const profileImageFile = {
    filename: 'any-cover-filename.pgn',
    mime: 'image/png',
    extension: 'png',
    data: 'only-image-data',
  }
  const fakeRequestWithCoverImage = makeFakeRequest({
    body: {
      ...bodyWithoutImages,
      profileImage: body.profileImage,
    },
    params: { id },
    files: {
      coverImage: coverImageFile,
    },
  })
  const fakeRequestWithProfileImage = makeFakeRequest({
    body: {
      ...bodyWithoutImages,
      coverImage: body.coverImage,
    },
    params: { id },
    files: {
      profileImage: profileImageFile,
    },
  })
  const fakeRequestWithBothImages = makeFakeRequest({
    body: bodyWithoutImages,
    params: { id },
    files: {
      coverImage: coverImageFile,
      profileImage: profileImageFile,
    },
  })
  const workspaceStub = new WorkspaceStub()
  const fileManagerStub = new FileManagerStub()
  const sut = new WorkspaceUpdateController({
    workspace: workspaceStub,
    fileManager: fileManagerStub,
  })

  return {
    sut,
    fakeRequest,
    fakeRequestWithBothImages,
    fakeRequestWithCoverImage,
    fakeRequestWithProfileImage,
    workspaceStub,
    fileManagerStub,
  }
}

describe('WorkspaceUpdateController', () => {
  test('Should return bad request error if workspace id is not provided', async () => {
    const { sut } = makeSut()
    const fakeRequestWithouId = makeFakeRequest({ params: {} })

    const output = sut.handle(fakeRequestWithouId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should return invalid param error if workspace provided is invalid', async () => {
    const { sut, fakeRequest, workspaceStub } = makeSut()

    jest.spyOn(workspaceStub, 'getById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new InvalidParamError('id'))
  })

  test('Should return invalid param error if provided title not to be a string', async () => {
    const { sut, fakeRequest } = makeSut()
    const fakeRequestWithWrongTitleBodyParam = makeFakeRequest({
      body: {
        ...fakeRequest.body,
        title: 156,
      },
    })

    const output = sut.handle(fakeRequestWithWrongTitleBodyParam)

    await expect(output).rejects.toThrow(new InvalidParamError('title must have to be a string'))
  })

  test('Should return invalid param error if provided members not to be a array', async () => {
    const { sut, fakeRequest } = makeSut()
    const fakeRequestWithWrongTitleBodyParam = makeFakeRequest({
      body: {
        ...fakeRequest.body,
        members: 'wrong-members-value',
      },
    })

    const output = sut.handle(fakeRequestWithWrongTitleBodyParam)

    await expect(output).rejects.toThrow(new InvalidParamError('members must have to be a array'))
  })

  test('Should not calls remove image method if have respective file and not have old image', async () => {
    const { sut, fakeRequestWithCoverImage, workspaceStub, fileManagerStub } = makeSut()

    jest.spyOn(workspaceStub, 'getById').mockReturnValueOnce(Promise.resolve({
      ...makeFakeWorkspace(),
      coverImage: '',
    }))
    const removerSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequestWithCoverImage)

    expect(removerSpy).not.toHaveBeenCalledWith(makeFakeWorkspace().coverImage)
    expect(removerSpy).toHaveBeenCalledTimes(0)
  })

  test('Should upload cover image and remove old cover image if a respective file is provided', async () => {
    const { sut, fakeRequestWithCoverImage, workspaceStub, fileManagerStub } = makeSut()
    const { id, ...params } = fakeRequestWithCoverImage.body
    const getByIdSpy = jest.spyOn(workspaceStub, 'getById')
    const setByIdSpy = jest.spyOn(workspaceStub, 'setById')
    const uploaderSpy = jest.spyOn(fileManagerStub, 'uploadImage')
    const removerSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequestWithCoverImage)

    expect(getByIdSpy).toHaveBeenCalledWith(fakeRequestWithCoverImage.params.id)
    expect(removerSpy).toHaveBeenCalledWith(makeFakeWorkspace().coverImage)
    expect(removerSpy).toHaveBeenCalledTimes(1)
    expect(uploaderSpy).toHaveBeenCalledWith(fakeRequestWithCoverImage.files.coverImage)
    expect(uploaderSpy).toHaveBeenCalledTimes(1)
    expect(setByIdSpy).toHaveBeenCalledWith(fakeRequestWithCoverImage.params.id, {
      ...params,
      coverImage: '/uploads/any-file-uploaded.png',
    })
  })

  test('Should upload profile image and remove old cover image if a respective file is provided', async () => {
    const { sut, fakeRequestWithProfileImage, workspaceStub, fileManagerStub } = makeSut()
    const { id, ...params } = fakeRequestWithProfileImage.body
    const getByIdSpy = jest.spyOn(workspaceStub, 'getById')
    const setByIdSpy = jest.spyOn(workspaceStub, 'setById')
    const uploaderSpy = jest.spyOn(fileManagerStub, 'uploadImage')
    const removerSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequestWithProfileImage)

    expect(getByIdSpy).toHaveBeenCalledWith(fakeRequestWithProfileImage.params.id)
    expect(removerSpy).toHaveBeenCalledWith(makeFakeWorkspace().profileImage)
    expect(removerSpy).toHaveBeenCalledTimes(1)
    expect(uploaderSpy).toHaveBeenCalledWith(fakeRequestWithProfileImage.files.profileImage)
    expect(uploaderSpy).toHaveBeenCalledTimes(1)
    expect(setByIdSpy).toHaveBeenCalledWith(fakeRequestWithProfileImage.params.id, {
      ...params,
      profileImage: '/uploads/any-file-uploaded.png',
    })
  })

  test('Should upload both images and remove old images if a respective files are provided', async () => {
    const { sut, fakeRequestWithBothImages, workspaceStub, fileManagerStub } = makeSut()
    const { id, ...params } = fakeRequestWithBothImages.body
    const getByIdSpy = jest.spyOn(workspaceStub, 'getById')
    const setByIdSpy = jest.spyOn(workspaceStub, 'setById')
    const uploaderSpy = jest.spyOn(fileManagerStub, 'uploadImage')
    const removerSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequestWithBothImages)

    expect(getByIdSpy).toHaveBeenCalledWith(fakeRequestWithBothImages.params.id)
    expect(removerSpy).toHaveBeenCalledWith(makeFakeWorkspace().coverImage)
    expect(removerSpy).toHaveBeenCalledWith(makeFakeWorkspace().profileImage)
    expect(removerSpy).toHaveBeenCalledTimes(2)
    expect(uploaderSpy).toHaveBeenCalledWith(fakeRequestWithBothImages.files.coverImage)
    expect(uploaderSpy).toHaveBeenCalledWith(fakeRequestWithBothImages.files.profileImage)
    expect(uploaderSpy).toHaveBeenCalledTimes(2)
    expect(setByIdSpy).toHaveBeenCalledWith(fakeRequestWithBothImages.params.id, {
      ...params,
      coverImage: '/uploads/any-file-uploaded.png',
      profileImage: '/uploads/any-file-uploaded.png',
    })
  })

  test('Should calls setById method of repository with correct values', async () => {
    const { sut, fakeRequest, workspaceStub } = makeSut()
    const { id, ...params } = fakeRequest.body
    const wrokspaceSpy = jest.spyOn(workspaceStub, 'setById')

    await sut.handle(fakeRequest)

    expect(wrokspaceSpy).toHaveBeenCalledWith(fakeRequest.params.id, params)
  })

  test('Should controller throw if any method throws', async () => {
    const { sut, fakeRequest, workspaceStub } = makeSut()
    jest.spyOn(workspaceStub, 'setById').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should return bad request error if setById method return false', async () => {
    const { sut, fakeRequest, workspaceStub } = makeSut()
    jest.spyOn(workspaceStub, 'setById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Workspace update fails!'))
  })

  test('Should return correct values if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, {
      message: 'Workspace update successfully',
      data: makeFakeWorkspace(),
    }))
  })
})
