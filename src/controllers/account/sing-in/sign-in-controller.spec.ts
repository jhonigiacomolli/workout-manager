import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { SignInController } from './sign-in-controller'
import { AccountStub } from '@/mocks/account/account-stub'
import { HasherStub } from '@/mocks/cryptography/hasher-stub'
import { EncrypterStub } from '@/mocks/cryptography/encrypter-stub'
import { ForbiddenError, NotFoundError, EmptyParamError } from '@/helpers/errors'

const makeSut = () => {
  const fakeRequest = makeFakeRequest({
    body: {
      email: 'any_email',
      password: 'any_password',
    },
  })
  const accountStub = new AccountStub()
  const hasherStub = new HasherStub()
  const encryptStub = new EncrypterStub()

  const sut = new SignInController({
    account: accountStub,
    hasher: hasherStub,
    encrypter: encryptStub,
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
    const output = sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        email: '',
      },
    })
    await expect(output).rejects.toThrow(new EmptyParamError('email'))
  })

  test('Should return 400 if no passwrod is provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        password: '',
      },
    })

    await expect(output).rejects.toThrow(new EmptyParamError('password'))
  })

  test('Should return 404 if email is not registed', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new NotFoundError('user not found'))
  })

  test('Should return 404 if user not found on getUserByEmail method', async () => {
    const { sut, fakeRequest, accountStub } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(true))
    jest.spyOn(accountStub, 'getUserByEmail').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new NotFoundError('user not found'))
  })

  test('Should return 403 if wrong password is provided', async () => {
    const { sut, accountStub, fakeRequest, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(true))
    const output = sut.handle(fakeRequest)
    await expect(output).rejects.toThrow(new ForbiddenError('wrong password'))
  })

  test('Should return 500 if any controller method throws', async () => {
    const { sut, fakeRequest, accountStub, hasherStub, encryptStub } = makeSut()

    jest.spyOn(accountStub, 'checkEmailInUse').mockImplementationOnce(() => { throw new Error() })
    const output = sut.handle(fakeRequest)
    await expect(output).rejects.toThrow()

    jest.spyOn(accountStub, 'getUserByEmail').mockImplementationOnce(() => { throw new Error() })
    const output2 = sut.handle(fakeRequest)
    await expect(output2).rejects.toThrow()

    jest.spyOn(hasherStub, 'compare').mockImplementationOnce(() => { throw new Error() })
    const output3 = sut.handle(fakeRequest)
    await expect(output3).rejects.toThrow()

    jest.spyOn(encryptStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const output4 = sut.handle(fakeRequest)
    await expect(output4).rejects.toThrow()
  })

  test('Should return accessToken if proccess succeeds', async () => {
    const { sut, accountStub, encryptStub, fakeRequest } = makeSut()

    const mockedEncrypt = jest.fn()
    mockedEncrypt.mockReturnValueOnce('encrypted_access_token')
    mockedEncrypt.mockReturnValueOnce('encrypted_refresh_token')
    jest.spyOn(encryptStub, 'encrypt').mockImplementation(mockedEncrypt)
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(true))

    const output = await sut.handle(fakeRequest)

    expect(mockedEncrypt).toHaveBeenCalledTimes(2)
    expect(mockedEncrypt).toHaveBeenCalledWith({ id: 'valid_id' }, { expire: 3600 })
    expect(mockedEncrypt).toHaveBeenCalledWith({ id: 'valid_id' }, { expire: 86400 })
    expect(output).toEqual(httpResponse(200, {
      accessToken: 'encrypted_access_token',
      refreshToken: 'encrypted_refresh_token',
    }))
  })
})
