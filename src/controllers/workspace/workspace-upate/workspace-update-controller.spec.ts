import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { WorkspaceStub } from '@/mocks/workspace/wokrspace-stub'
import { makeFakeWorkspace } from '@/mocks/workspace/workspace-fakes'
import { WorkspaceUpdateController } from './workspace-update-controller'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

const makeSut = () => {
  const { id, createdAt, ...body } = makeFakeWorkspace()
  const fakeRequest = makeFakeRequest({
    body,
    params: { id },
  })
  const workspaceStub = new WorkspaceStub()
  const sut = new WorkspaceUpdateController({
    workspace: workspaceStub,
  })

  return {
    sut,
    fakeRequest,
    workspaceStub,
  }
}

describe('WorkspaceUpdateController', () => {
  test('Should return bad request error if workspace id is not provided', async () => {
    const { sut } = makeSut()
    const fakeRequestWithouId = makeFakeRequest({ params: {} })

    const output = sut.handle(fakeRequestWithouId)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  const { sut, fakeRequest, workspaceStub } = makeSut()
  test('Should return invalid param error if workspace provided is invalid', async () => {
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
