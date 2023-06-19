import { httpRequest, httpResponse } from '@/helpers/http'
import { AccountStub } from '@/mocks/account/account-stub'
import { HasherStub } from '@/mocks/cryptography/hasher-stub'
import { makeFakeAccount } from '@/mocks/account/make-fake-account'
import { AccountUdateController } from './account-update-controller'
import { EncrypterStub } from '@/mocks/cryptography/encrypter-stub'

const makeSut = () => {
  const body = {
    ...makeFakeAccount(),
    passwordConfirmation: makeFakeAccount().password,
  }
  const headers = {
    authorization: 'valid_access_token',
  }
  const fakeRequest = httpRequest(body, headers)

  const accountStub = new AccountStub()
  const hasherStub = new HasherStub()
  const encrypterStub = new EncrypterStub()

  const sut = new AccountUdateController({
    account: accountStub,
    hasher: hasherStub,
    encrypter: encrypterStub,
  })

  return {
    sut,
    accountStub,
    hasherStub,
    encrypterStub,
    fakeRequest,
  }
}

describe('Account Update Controller', () => {
  test('Should return 401 if accessToken is not provided on header', async () => {
    const { sut, fakeRequest } = makeSut()
    const result = await sut.handle({
      ...fakeRequest,
      headers: {
        authorization: '',
      },
    })
    expect(result).toEqual(httpResponse(401, 'Unauthorized'))
  })
  test('Should return 401 if accessToken is not a valid token', async () => {
    const { sut, encrypterStub, fakeRequest } = makeSut()

    jest.spyOn(encrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve({ id: '' }))

    const result = await sut.handle({
      ...fakeRequest,
      headers: {
        authorization: 'invalid_token',
      },
    })
    expect(result).toEqual(httpResponse(401, 'Unauthorized'))
  })
  test('Should return 500 if decrypt method throws', async () => {
    const { sut, encrypterStub, fakeRequest } = makeSut()

    jest.spyOn(encrypterStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error()
    })

    const result = await sut.handle(fakeRequest)

    expect(result).toEqual(httpResponse(500, 'Internal Server Error'))
  })
  test('Should return 400 if setUserById method return false', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()

    jest.spyOn(accountStub, 'setUserById').mockReturnValueOnce(Promise.resolve(false))

    const result = await sut.handle(fakeRequest)

    expect(result).toEqual(httpResponse(400, 'Account update fails'))
  })
  test('Should return 500 if setUserById method throws', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()

    jest.spyOn(accountStub, 'setUserById').mockImplementationOnce(() => {
      throw new Error()
    })

    const result = await sut.handle(fakeRequest)

    expect(result).toEqual(httpResponse(500, 'Internal Server Error'))
  })
  test('Should return 400 if id is not provided on body', async () => {
    const { sut, fakeRequest } = makeSut()

    const result = await sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        id: '',
      },
    })

    expect(result).toEqual(httpResponse(400, 'Empty param: id is required'))
  })
  test('Should return 400 if name is not provided on body', async () => {
    const { sut, fakeRequest } = makeSut()

    const result = await sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        name: '',
      },
    })

    expect(result).toEqual(httpResponse(400, 'Empty param: name is required'))
  })
  test('Should return 400 if email is not provided on body', async () => {
    const { sut, fakeRequest } = makeSut()

    const result = await sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        email: '',
      },
    })

    expect(result).toEqual(httpResponse(400, 'Empty param: email is required'))
  })
  test('Should return 200 when update successfull', async () => {
    const { sut, fakeRequest } = makeSut()

    const result = await sut.handle(fakeRequest)

    expect(result).toEqual(httpResponse(201, 'User updated successfully'))
  })
})
