import { httpRequest, httpResponse } from '@/helpers/http'
import { makeFakeWorkspace } from '@/mocks/workspace/make-fake-workspace'
import { WorkspaceStub } from '@/mocks/workspace/wokrspace-stub'
import { WorkspaceLoadAllITemsController } from './workspace-load-all-items-controller'

const makeSut = () => {
  const fakeRequest = httpRequest({}, {}, {}, {
    pagination: {
      limit: '10',
      page: '1',
      offset: '0',
      order: 'DESC',
      orderBy: 'id',
    },
  })
  const workspaceStub = new WorkspaceStub()
  const sut = new WorkspaceLoadAllITemsController({
    workspace: workspaceStub,
  })
  return {
    sut,
    workspaceStub,
    fakeRequest,
  }
}

describe('WorkspaceLoadAllITemsController', () => {
  test('Should controller wthrows if getAll method throw', async () => {
    const { sut, fakeRequest, workspaceStub } = makeSut()

    jest.spyOn(workspaceStub, 'getAll').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })
  test('Should getAll method calls with corred params', async () => {
    const { sut, fakeRequest, workspaceStub } = makeSut()

    const workspaceSpy = jest.spyOn(workspaceStub, 'getAll')

    await sut.handle(fakeRequest)

    expect(workspaceSpy).toHaveBeenCalledWith(fakeRequest.query.pagination)
  })
  test('Should getAll method calls with corred params if invalid orderby param is provided', async () => {
    const { sut, fakeRequest, workspaceStub } = makeSut()

    const workspaceSpy = jest.spyOn(workspaceStub, 'getAll')
    const fakeRequestWithInvalidParam = {
      ...fakeRequest,
      query: {
        ...fakeRequest.query,
        pagination: {
          ...fakeRequest.query.pagination,
          orderBy: 'wrong',
        },
      },
    }
    await sut.handle(fakeRequestWithInvalidParam)

    expect(workspaceSpy).toHaveBeenCalledWith({
      ...fakeRequest.query.pagination,
      orderBy: 'title',
    })
  })
  test('Should return a empty list of workspacess do not have entries on database', async () => {
    const { sut, fakeRequest, workspaceStub } = makeSut()

    jest.spyOn(workspaceStub, 'getAll').mockReturnValueOnce(Promise.resolve([]))

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, []))
  })
  test('Should return a list of workspacess if succeeds', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, [makeFakeWorkspace(), makeFakeWorkspace()]))
  })
})
