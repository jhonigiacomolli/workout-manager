import { httpRequest, httpResponse } from '@/helpers/http'
import { WorkspaceStub } from '@/mocks/workspace/wokrspace-stub'
import { BadRequestError, NotFoundError } from '@/helpers/errors'
import { makeFakeWorkspace } from '@/mocks/workspace/make-fake-workspace'
import { WorkspaceLoadItemController } from './workspace-load-item-controller'

const makeSut = () => {
  const fakeRequestHeaders = {}
  const fakeRequestBody = {}
  const fakeRequestParams = {
    id: 'any_id',
  }
  const fakeRequest = httpRequest(fakeRequestBody, fakeRequestHeaders, fakeRequestParams)
  const workspaceStub = new WorkspaceStub()
  const sut = new WorkspaceLoadItemController({
    workspace: workspaceStub,
  })

  return {
    sut,
    fakeRequest,
    workspaceStub,
  }
}

describe('WorkspaceLoadItemController', () => {
  test('Should return bad request error if id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithouId = {
      ...fakeRequest,
      params: {},
    }

    const output = sut.handle(fakeRequestWithouId)

    await expect(output).rejects.toThrow(new BadRequestError('Required param id is not provided'))
  })
  test('Should controller calls getById with correct param', async () => {
    const { sut, fakeRequest, workspaceStub } = makeSut()

    const workspaceSpy = jest.spyOn(workspaceStub, 'getById')

    await sut.handle(fakeRequest)

    expect(workspaceSpy).toHaveBeenCalledWith(fakeRequest.params.id)
  })
  test('Should return invalid param error if provided id is invalid', async () => {
    const { sut, fakeRequest, workspaceStub } = makeSut()

    jest.spyOn(workspaceStub, 'getById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new NotFoundError('Workspace not found!'))
  })
  test('Should throws error if getById method throws', async () => {
    const { sut, fakeRequest, workspaceStub } = makeSut()

    jest.spyOn(workspaceStub, 'getById').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })
  test('Should return a workspace data correctly id proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, makeFakeWorkspace()))
  })
})
