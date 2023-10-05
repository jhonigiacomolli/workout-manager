import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { WorkspaceStub } from '@/mocks/workspace/wokrspace-stub'
import { makeFakeWorkspace } from '@/mocks/workspace/workspace-fakes'
import { WorkspaceCreateController } from './workspace-create-controller'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'
import { FileManagerStub } from '@/mocks/file-manager/file-manager-stub'

const makeSut = () => {
  const { id, coverImage, profileImage, ...body } = makeFakeWorkspace()
  const coverImageFile = {
    filename: 'any-cover-filename.pgn',
    mime: 'image/png',
    extension: 'png',
    data: 'only-image-data',
  }
  const profileImageFile = {
    filename: 'any-profile-filename.pgn',
    mime: 'image/png',
    extension: 'png',
    data: 'only-image-data',
  }
  const fakeRequest = makeFakeRequest({
    body,
    params: { id },
  })
  const fakeRequestWithImages = makeFakeRequest({
    body,
    params: { id },
    files: {
      coverImage: coverImageFile,
      profileImage: profileImageFile,
    },
  })
  const fakeRequestWithCoverImage = makeFakeRequest({
    body,
    params: { id },
    files: {
      coverImage: coverImageFile,
    },
  })
  const fakeRequestWithProfileImage = makeFakeRequest({
    body,
    params: { id },
    files: {
      profileImage: profileImageFile,
    },
  })

  const worksSpaceStub = new WorkspaceStub()
  const fileManagerStub = new FileManagerStub()
  const sut = new WorkspaceCreateController({
    workspace: worksSpaceStub,
    fileManager: fileManagerStub,
  })

  return {
    sut,
    fakeRequest,
    fakeRequestWithImages,
    fakeRequestWithCoverImage,
    fakeRequestWithProfileImage,
    fileManagerStub,
    worksSpaceStub,
  }
}

describe('WorkSpaceCreateController', () => {
  test('Should 400 if title is not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    const fakeRequestWIthoutBody = {
      ...fakeRequest,
      body: {},
    }

    const output = sut.handle(fakeRequestWIthoutBody)

    await expect(output).rejects.toThrow(new EmptyParamError('title'))
  })

  test('Should 400 if title is not a string', async () => {
    const { sut, fakeRequest } = makeSut()
    const fakeRequestWithNumberTitle = {
      ...fakeRequest,
      body: {
        title: 15,
      },
    }

    const output = sut.handle(fakeRequestWithNumberTitle)

    await expect(output).rejects.toThrow(new InvalidParamError('title must to be a string'))

    const fakeRequestWithObjectTitle = {
      ...fakeRequest,
      body: {
        title: {},
      },
    }
    const objectOutput = sut.handle(fakeRequestWithObjectTitle)
    await expect(objectOutput).rejects.toThrow(new InvalidParamError('title must to be a string'))
  })

  test('Should 400 if members is not a array', async () => {
    const { sut, fakeRequest } = makeSut()
    const fakeRequestWithMembersObject = {
      ...fakeRequest,
      body: {
        title: 'any title',
        members: {},
      },
    }

    const output = sut.handle(fakeRequestWithMembersObject)

    await expect(output).rejects.toThrow(new InvalidParamError('members must to be a array'))
  })

  test('Should calls uploadImage if coverImage file is provided', async () => {
    const { sut, fakeRequestWithCoverImage, fileManagerStub } = makeSut()

    const uploaderSpy = jest.spyOn(fileManagerStub, 'uploadImage')

    await sut.handle(fakeRequestWithCoverImage)

    expect(uploaderSpy).toHaveBeenCalledWith(fakeRequestWithCoverImage.files.coverImage)
    expect(uploaderSpy).toHaveBeenCalledTimes(1)
  })

  test('Should calls create method with correct image path when coverImage file is provided', async () => {
    const { sut, fakeRequestWithCoverImage, worksSpaceStub } = makeSut()

    const workspaceCreateSpy = jest.spyOn(worksSpaceStub, 'create')

    await sut.handle(fakeRequestWithCoverImage)

    expect(workspaceCreateSpy).toHaveBeenCalledWith({
      ...fakeRequestWithCoverImage.body,
      coverImage: '/uploads/any-file-uploaded.png',
      profileImage: '',
    })
    expect(workspaceCreateSpy).toHaveBeenCalledTimes(1)
  })

  test('Should calls uploadImage if profileImage file is provided', async () => {
    const { sut, fakeRequestWithProfileImage, fileManagerStub } = makeSut()

    const uploaderSpy = jest.spyOn(fileManagerStub, 'uploadImage')

    await sut.handle(fakeRequestWithProfileImage)

    expect(uploaderSpy).toHaveBeenCalledWith(fakeRequestWithProfileImage.files.profileImage)
    expect(uploaderSpy).toHaveBeenCalledTimes(1)
  })

  test('Should calls create method with correct image path when profileImage file is provided', async () => {
    const { sut, fakeRequestWithProfileImage, worksSpaceStub } = makeSut()

    const workspaceCreateSpy = jest.spyOn(worksSpaceStub, 'create')

    await sut.handle(fakeRequestWithProfileImage)

    expect(workspaceCreateSpy).toHaveBeenCalledWith({
      ...fakeRequestWithProfileImage.body,
      profileImage: '/uploads/any-file-uploaded.png',
      coverImage: '',
    })
    expect(workspaceCreateSpy).toHaveBeenCalledTimes(1)
  })

  test('Should calls create method with correct params', async () => {
    const { sut, fakeRequest, worksSpaceStub } = makeSut()

    const worksSpaceSpy = jest.spyOn(worksSpaceStub, 'create')

    await sut.handle(fakeRequest)

    expect(worksSpaceSpy).toHaveBeenCalledWith({
      ...fakeRequest.body,
      coverImage: '',
      profileImage: '',
    })

    const fakeRequestWithWrongParams = { ...fakeRequest }

    delete fakeRequestWithWrongParams.body.members

    await sut.handle(fakeRequestWithWrongParams)

    expect(worksSpaceSpy).toHaveBeenCalledWith({
      ...fakeRequest.body,
      members: [],
      coverImage: '',
      profileImage: '',
    })
  })

  test('Should return 400 if create method returns undefined', async () => {
    const { sut, fakeRequest, worksSpaceStub } = makeSut()

    jest.spyOn(worksSpaceStub, 'create').mockReturnValue(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Workspace create fails!'))
  })

  test('Should return correct values if process succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, {
      message: 'Workspace created successfully!',
      data: {
        ...makeFakeWorkspace(),
        coverImage: fakeRequest.baseUrl + makeFakeWorkspace().coverImage,
        profileImage: fakeRequest.baseUrl + makeFakeWorkspace().profileImage,
      },
    }))
  })

  test('Should return a new workspace with correct params if image files are provided', async () => {
    const { sut, fakeRequestWithImages, fileManagerStub } = makeSut()

    const uploaderSpy = jest.spyOn(fileManagerStub, 'uploadImage')

    const output = await sut.handle(fakeRequestWithImages)

    expect(uploaderSpy).toHaveBeenCalledTimes(2)
    expect(output).toEqual(httpResponse(200, {
      message: 'Workspace created successfully!',
      data: {
        ...makeFakeWorkspace(),
        coverImage: fakeRequestWithImages.baseUrl + makeFakeWorkspace().coverImage,
        profileImage: fakeRequestWithImages.baseUrl + makeFakeWorkspace().profileImage,
      },
    }))
  })

  test('Should return a new workspace with correct params if only one image is provided', async () => {
    const { sut, fakeRequestWithCoverImage, fileManagerStub, worksSpaceStub } = makeSut()

    const uploaderSpy = jest.spyOn(fileManagerStub, 'uploadImage')
    jest.spyOn(worksSpaceStub, 'create').mockReturnValueOnce(Promise.resolve({
      ...makeFakeWorkspace(),
      profileImage: '',
    }))

    const output = await sut.handle(fakeRequestWithCoverImage)

    expect(uploaderSpy).toHaveBeenCalledTimes(1)
    expect(output).toEqual(httpResponse(200, {
      message: 'Workspace created successfully!',
      data: {
        ...makeFakeWorkspace(),
        coverImage: fakeRequestWithCoverImage.baseUrl + makeFakeWorkspace().coverImage,
        profileImage: '',
      },
    }))
  })
})
