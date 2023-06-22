import { SignInController } from './sign-in-controller'
import { httpRequest, httpResponse } from '@/helpers/http'
import { AccountStub } from '@/mocks/account/account-stub'
import { HasherStub } from '@/mocks/cryptography/hasher-stub'
import { EncrypterStub } from '@/mocks/cryptography/encrypter-stub'

const makeSut = () => {
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
    const { sut, encryptStub, fakeRequest } = makeSut()
    const mockedEncrypt = jest.fn()
    mockedEncrypt.mockReturnValueOnce('encrypted_access_token')
    mockedEncrypt.mockReturnValueOnce('encrypted_refresh_token')
    jest.spyOn(encryptStub, 'encrypt').mockImplementation(mockedEncrypt)
    const response = await sut.handle(fakeRequest)
    expect(mockedEncrypt).toHaveBeenCalledTimes(2)
    expect(mockedEncrypt).toHaveBeenCalledWith('valid_id', { expire: 3600 })
    expect(mockedEncrypt).toHaveBeenCalledWith('valid_id', { expire: 86400 })
    expect(response).toEqual(httpResponse(200, {
      accessToken: 'encrypted_access_token',
      refreshToken: 'encrypted_refresh_token',
    }))
  })
})
