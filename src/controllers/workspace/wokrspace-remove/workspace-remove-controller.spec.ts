import { httpRequest, httpResponse } from '@/helpers/http'
import { WorkspaceStub } from '@/mocks/workspace/wokrspace-stub'
import { WorkspaceRemoveController } from './workspace-remove-controller'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

const makeSut = () => {
  const fakeRequestBody = {}
  const fakeRequestHeaders = {}
  const fakeRequestParams = {
    id: 'any_id',
  }
  const fakeRequest = httpRequest(fakeRequestBody, fakeRequestHeaders, fakeRequestParams)
  const workspaceStub = new WorkspaceStub()
  const sut = new WorkspaceRemoveController({
    workspace: workspaceStub,
  })

  return {
    sut,
    fakeRequest,
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
