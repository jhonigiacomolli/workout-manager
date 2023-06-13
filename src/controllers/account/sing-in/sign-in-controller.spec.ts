import { type Account } from '@/protocols/use-cases/account'
import { type AccountModel } from '@/protocols/models/account'
import { type Hasher } from '@/protocols/use-cases/cryptography/hashser'
import { type Encrypter } from '@/protocols/use-cases/cryptography/encrypter'

import { SignInController } from './sign-in-controller'
import { httpRequest, httpResponse } from '@/helpers/http'
import { makeFakeAccount } from '@/mocks/account/make-fake-account'

const makeSut = () => {
  class AccountStub implements Account {
    async create(): Promise<boolean> {
      return await Promise.resolve(true)
    }

    async checkEmailInUse(): Promise<boolean> {
      return await Promise.resolve(true)
    }

    async getUserByEmail(): Promise<AccountModel | undefined> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  class HasherStub implements Hasher {
    async generate(): Promise<string> {
      return await Promise.resolve('hashed_password')
    }

    async compare(): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return await Promise.resolve('encrypted_token')
    }
  }

  const accountStub = new AccountStub()
  const hasherStub = new HasherStub()
  const encryptStub = new EncrypterStub()

  const sut = new SignInController({
    account: accountStub,
    hasher: hasherStub,
    encrypter: encryptStub,
  })
  const fakeRequest = httpRequest({
    email: 'any_email',
    password: 'any_password',
  })
  return {
    sut,
    fakeRequest,
    accountStub,
    hasherStub,
    encryptStub,
  }
}

describe('Sign in', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut, fakeRequest } = makeSut()
    const response = await sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        email: '',
      },
    })
    expect(response).toEqual(httpResponse(400, 'Empty param: email is required'))
  })
  test('Should return 400 if no passwrod is provided', async () => {
    const { sut, fakeRequest } = makeSut()
    const response = await sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        password: '',
      },
    })
    expect(response).toEqual(httpResponse(400, 'Empty param: password is required'))
  })
  test('Should return 404 if email is not registed', async () => {
    const { sut, fakeRequest, accountStub } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(httpResponse(404, 'user not found'))
  })
  test('Should return 404 if user not found on get email by emai method', async () => {
    const { sut, fakeRequest, accountStub } = makeSut()
    jest.spyOn(accountStub, 'getUserByEmail').mockReturnValueOnce(Promise.resolve(undefined))
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(httpResponse(404, 'user not found'))
  })
  test('Should return 403 if wrong password is provided', async () => {
    const { sut, fakeRequest, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(httpResponse(403, 'wrong password'))
  })
  test('Should return 500 if any controller method throws', async () => {
    const { sut, fakeRequest, accountStub, hasherStub, encryptStub } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockImplementationOnce(() => { throw new Error() })
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(httpResponse(500, 'Internal Server Error'))

    jest.spyOn(accountStub, 'getUserByEmail').mockImplementationOnce(() => { throw new Error() })
    const response2 = await sut.handle(fakeRequest)
    expect(response2).toEqual(httpResponse(500, 'Internal Server Error'))

    jest.spyOn(hasherStub, 'compare').mockImplementationOnce(() => { throw new Error() })
    const response3 = await sut.handle(fakeRequest)
    expect(response3).toEqual(httpResponse(500, 'Internal Server Error'))

    jest.spyOn(encryptStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const response4 = await sut.handle(fakeRequest)
    expect(response4).toEqual(httpResponse(500, 'Internal Server Error'))
  })
  test('Should return accessToken if proccess succeeds', async () => {
    const { sut, fakeRequest } = makeSut()
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(httpResponse(200, {
      accessToken: 'encrypted_token',
    }))
  })
})
