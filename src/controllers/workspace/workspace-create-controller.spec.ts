import { httpRequest, httpResponse } from '@/helpers/http'
import { WorkspaceStub } from '@/mocks/workspace/wokrspace-stub'
import { makeFakeWorkspace } from '@/mocks/workspace/make-fake-workspace'
import { WorkspaceCreateController } from './workspace-create-controller'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

const makeSut = () => {
  const fakeRequestHeader = {
    authorization: 'valid_access_token',
  }
  const { id, ...params } = makeFakeWorkspace()
  const fakeResquestBody = params
  const fakeRequest = httpRequest(fakeResquestBody, fakeRequestHeader)
  const worksSpaceStub = new WorkspaceStub()
  const sut = new WorkspaceCreateController({
    workspace: worksSpaceStub,
  })

  return {
    sut,
    fakeRequest,
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
  test('Should calls create method with correct params', async () => {
    const { sut, fakeRequest, worksSpaceStub } = makeSut()

    const worksSpaceSpy = jest.spyOn(worksSpaceStub, 'create')

    await sut.handle(fakeRequest)

    expect(worksSpaceSpy).toHaveBeenCalledWith(fakeRequest.body)

    const fakeRequestWithWrongParams = { ...fakeRequest }

    delete fakeRequest.body.memebrs

    await sut.handle(fakeRequestWithWrongParams)

    expect(worksSpaceSpy).toHaveBeenCalledWith(fakeRequest.body)
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
      data: makeFakeWorkspace(),
    }))
  })
})
