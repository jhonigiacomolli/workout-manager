import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { AccountStub } from '@/mocks/account/account-stub'
import { BadRequestError, EmptyParamError, InternalServerError } from '@/helpers/errors'
import { AccountRemoveController } from './account-remove-controller'
import { FileManagerStub } from '@/mocks/file-manager/file-manager-stub'
import { makeFakeAccount } from '@/mocks/account/account-fakes'

const makeSut = () => {
  const fakeRequest = makeFakeRequest()
  const accountStub = new AccountStub()
  const fileManagerStub = new FileManagerStub()
  const sut = new AccountRemoveController({
    account: accountStub,
    fileManager: fileManagerStub,
  })

  return {
    sut,
    fakeRequest,
    accountStub,
    fileManagerStub,
  }
}

describe('Account Remove Controller', () => {
  test('Should call getUserById with correct id', async () => {
    const { sut, fakeRequest, accountStub } = makeSut()

    const accountSpy = jest.spyOn(accountStub, 'getUserById')

    await sut.handle(fakeRequest)

    expect(accountSpy).toHaveBeenCalledWith(fakeRequest.params.id)
  })

  test('Should call removeImage method with correct image path if account have image', async () => {
    const { sut, fakeRequest, fileManagerStub } = makeSut()

    const fileManagerSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequest)

    expect(fileManagerSpy).toHaveBeenCalledWith(makeFakeAccount().image)
  })

  test('Should do not call removeImage method if account do not have image', async () => {
    const { sut, fakeRequest, fileManagerStub, accountStub } = makeSut()

    jest.spyOn(accountStub, 'getUserById').mockReturnValueOnce(Promise.resolve({
      ...makeFakeAccount(),
      image: '',
    }))

    const fileManagerSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequest)

    expect(fileManagerSpy).not.toHaveBeenCalled()
  })

  test('Should do not call removeImage method if account returned is undefined', async () => {
    const { sut, fakeRequest, fileManagerStub, accountStub } = makeSut()

    jest.spyOn(accountStub, 'getUserById').mockReturnValueOnce(Promise.resolve(undefined))

    const fileManagerSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequest)

    expect(fileManagerSpy).not.toHaveBeenCalled()
  })

  test('Should return internal server errror if removeImage return false', async () => {
    const { sut, fakeRequest, fileManagerStub } = makeSut()

    jest.spyOn(fileManagerStub, 'removeImage').mockReturnValueOnce(Promise.resolve(false))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new InternalServerError('Failed to remove image!'))
  })

  test('Should return 200 if account is removed', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(204, 'User removed'))
  })

  test('Should return 400 if no account id is provided with param', async () => {
    const { sut, fakeRequest } = makeSut()

    const wrongFakeRequest = { ...fakeRequest }
    wrongFakeRequest.params = {}

    const output = sut.handle(wrongFakeRequest)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should return 400 if no account delete method return false', async () => {
    const { sut, fakeRequest, accountStub } = makeSut()

    jest.spyOn(accountStub, 'delete').mockReturnValueOnce(Promise.resolve(false))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('User removal failed'))
  })

  test('Should return 500 if any method throws', async () => {
    const { sut, fakeRequest, accountStub } = makeSut()

    jest.spyOn(accountStub, 'delete').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })
})
