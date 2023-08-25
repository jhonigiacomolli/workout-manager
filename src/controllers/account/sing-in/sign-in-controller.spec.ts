import { SignInController } from './sign-in-controller'
import { httpRequest, httpResponse } from '@/helpers/http'
import { AccountStub } from '@/mocks/account/account-stub'
import { HasherStub } from '@/mocks/cryptography/hasher-stub'
import { EncrypterStub } from '@/mocks/cryptography/encrypter-stub'
import { ForbiddenError, NotFoundError, EmptyParamError } from '@/helpers/errors'

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
    const response = sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        email: '',
      },
    })
    await expect(response).rejects.toThrow(new EmptyParamError('email'))
  })
  test('Should return 400 if no passwrod is provided', async () => {
    const { sut, fakeRequest } = makeSut()
    const response = sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        password: '',
      },
    })
    await expect(response).rejects.toThrow(new EmptyParamError('password'))
  })
  test('Should return 404 if email is not registed', async () => {
    const { sut, fakeRequest } = makeSut()
    const response = sut.handle(fakeRequest)
    await expect(response).rejects.toThrow(new NotFoundError('user not found'))
  })
  test('Should return 404 if user not found on getUserByEmail method', async () => {
    const { sut, fakeRequest, accountStub } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(true))
    jest.spyOn(accountStub, 'getUserByEmail').mockReturnValueOnce(Promise.resolve(undefined))
    const response = sut.handle(fakeRequest)
    await expect(response).rejects.toThrow(new NotFoundError('user not found'))
  })

  test('Should return 403 if wrong password is provided', async () => {
    const { sut, accountStub, fakeRequest, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(true))
    const response = sut.handle(fakeRequest)
    await expect(response).rejects.toThrow(new ForbiddenError('wrong password'))
  })
  test('Should return 500 if any controller method throws', async () => {
    const { sut, fakeRequest, accountStub, hasherStub, encryptStub } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockImplementationOnce(() => { throw new Error() })
    const response = sut.handle(fakeRequest)
    await expect(response).rejects.toThrow()

    jest.spyOn(accountStub, 'getUserByEmail').mockImplementationOnce(() => { throw new Error() })
    const response2 = sut.handle(fakeRequest)
    await expect(response2).rejects.toThrow()

    jest.spyOn(hasherStub, 'compare').mockImplementationOnce(() => { throw new Error() })
    const response3 = sut.handle(fakeRequest)
    await expect(response3).rejects.toThrow()

    jest.spyOn(encryptStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const response4 = sut.handle(fakeRequest)
    await expect(response4).rejects.toThrow()
  })
  test('Should return accessToken if proccess succeeds', async () => {
    const { sut, accountStub, encryptStub, fakeRequest } = makeSut()

    const mockedEncrypt = jest.fn()
    mockedEncrypt.mockReturnValueOnce('encrypted_access_token')
    mockedEncrypt.mockReturnValueOnce('encrypted_refresh_token')
    jest.spyOn(encryptStub, 'encrypt').mockImplementation(mockedEncrypt)
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(true))

    const response = await sut.handle(fakeRequest)

    expect(mockedEncrypt).toHaveBeenCalledTimes(2)
    expect(mockedEncrypt).toHaveBeenCalledWith({ id: 'valid_id' }, { expire: 3600 })
    expect(mockedEncrypt).toHaveBeenCalledWith({ id: 'valid_id' }, { expire: 86400 })
    expect(response).toEqual(httpResponse(200, {
      accessToken: 'encrypted_access_token',
      refreshToken: 'encrypted_refresh_token',
    }))
  })
})
