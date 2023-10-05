import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { WorkspaceStub } from '@/mocks/workspace/wokrspace-stub'
import { makeFakeWorkspace } from '@/mocks/workspace/workspace-fakes'
import { FileManagerStub } from '@/mocks/file-manager/file-manager-stub'
import { WorkspaceRemoveController } from './workspace-remove-controller'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

const makeSut = () => {
  const fakeRequest = makeFakeRequest()
  const workspaceStub = new WorkspaceStub()
  const fileManegerStub = new FileManagerStub()
  const sut = new WorkspaceRemoveController({
    workspace: workspaceStub,
    fileManager: fileManegerStub,
  })

  return {
    sut,
    fakeRequest,
    fileManegerStub,
    workspaceStub,
  }
}

describe('WorkspaceRemoveController', () => {
  test('Should return empty param if workspace id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    const fakeRequestWithouId = { ...fakeRequest }
    fakeRequestWithouId.params = {}

    const output = sut.handle(fakeRequestWithouId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should return invalid param errror if workspace id provided is invalid', async () => {
    const { sut, fakeRequest, workspaceStub } = makeSut()
    const fakeRequestWithInvalidId = { ...fakeRequest }
    fakeRequestWithInvalidId.params.id = 'invalid-id'

    jest.spyOn(workspaceStub, 'getById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequestWithInvalidId)

    await expect(output).rejects.toThrow(new InvalidParamError('id'))
  })

  test('Should remove coverImage and profileImage before delete workspace', async () => {
    const { sut, fakeRequest, fileManegerStub } = makeSut()

    const removerSpy = jest.spyOn(fileManegerStub, 'removeImage')

    await sut.handle(fakeRequest)

    expect(removerSpy).toHaveBeenCalledWith(makeFakeWorkspace().coverImage)
    expect(removerSpy).toHaveBeenCalledWith(makeFakeWorkspace().profileImage)
    expect(removerSpy).toHaveBeenCalledTimes(2)
  })

  test('Should remove only coverImage if profileImage is empty before delete workspace', async () => {
    const { sut, fakeRequest, workspaceStub, fileManegerStub } = makeSut()

    jest.spyOn(workspaceStub, 'getById').mockReturnValueOnce(Promise.resolve({
      ...makeFakeWorkspace(),
      profileImage: '',
    }))
    const removerSpy = jest.spyOn(fileManegerStub, 'removeImage')

    await sut.handle(fakeRequest)

    expect(removerSpy).toHaveBeenCalledWith(makeFakeWorkspace().coverImage)
    expect(removerSpy).toHaveBeenCalledTimes(1)
  })

  test('Should remove only profileImage if coverImage is empty before delete workspace', async () => {
    const { sut, fakeRequest, workspaceStub, fileManegerStub } = makeSut()

    jest.spyOn(workspaceStub, 'getById').mockReturnValueOnce(Promise.resolve({
      ...makeFakeWorkspace(),
      coverImage: '',
    }))
    const removerSpy = jest.spyOn(fileManegerStub, 'removeImage')

    await sut.handle(fakeRequest)

    expect(removerSpy).toHaveBeenCalledWith(makeFakeWorkspace().profileImage)
    expect(removerSpy).toHaveBeenCalledTimes(1)
  })

  test('Should not calls remove method if both images are empty', async () => {
    const { sut, fakeRequest, workspaceStub, fileManegerStub } = makeSut()

    jest.spyOn(workspaceStub, 'getById').mockReturnValueOnce(Promise.resolve({
      ...makeFakeWorkspace(),
      coverImage: '',
      profileImage: '',
    }))
    const removerSpy = jest.spyOn(fileManegerStub, 'removeImage')

    await sut.handle(fakeRequest)

    expect(removerSpy).toHaveBeenCalledTimes(0)
  })

  test('Should return bad request error if workspace delete method return false', async () => {
    const { sut, fakeRequest, workspaceStub } = makeSut()

    jest.spyOn(workspaceStub, 'delete').mockReturnValueOnce(Promise.resolve(false))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Workspace remove failed!'))
  })

  test('Should controller throws id any method throw', async () => {
    const { sut, fakeRequest, workspaceStub } = makeSut()

    jest.spyOn(workspaceStub, 'getById').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should return 204 with method succeeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(204, 'Workspace removed!'))
  })
})
