import { httpRequest, httpResponse } from '@/helpers/http'
import { RefreshTokenController } from './refresh-token'
import { EncrypterStub } from '@/mocks/cryptography/encrypter-stub'
import { ForbiddenError } from '@/helpers/errors'

const fakeCorrectRequest = httpRequest({
  refreshToken: 'valid_refresh_token',
}, {})

const fakeWrongRequest = httpRequest({}, {})

const makeSut = () => {
  const encrypterStub = new EncrypterStub()
  const sut = new RefreshTokenController({
    encrypter: encrypterStub,
  })

  return {
    sut,
    encrypterStub,
  }
}

describe('Refresh Token', () => {
  test('Should return 403 if refresh token is not provided on body', async () => {
    const { sut } = makeSut()

    const result = sut.handle(fakeWrongRequest)

    await expect(result).rejects.toThrow(new ForbiddenError('Empty param: refreshToken is required'))
  })
  test('Should return 403 if refresh token is invalid', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve({
      data: {},
      status: { success: true, message: '' },
    }))

    const result = sut.handle(fakeCorrectRequest)

    await expect(result).rejects.toThrow(new ForbiddenError('Invalid param: refreshToken'))
  })
  test('Should return 403 if refresh token is expired', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve({
      data: {},
      status: { success: false, message: 'Expired token' },
    }))

    const result = sut.handle(fakeCorrectRequest)

    await expect(result).rejects.toThrow(new ForbiddenError('Expired token'))
  })
  test('Should return 500 if encrypt throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'decrypt').mockImplementationOnce(() => { throw new Error() })

    const result = sut.handle(fakeCorrectRequest)

    await expect(result).rejects.toThrow()
  })
  test('Should return accessToken and refreshToken if proccess succeeds', async () => {
    const { sut, encrypterStub } = makeSut()

    const mockedEncryptFn = jest.fn()
    mockedEncryptFn.mockReturnValueOnce('encrypted_access_token')
    mockedEncryptFn.mockReturnValueOnce('encrypted_refresh_token')

    jest.spyOn(encrypterStub, 'encrypt').mockImplementation(mockedEncryptFn)

    const response = await sut.handle(fakeCorrectRequest)

    expect(mockedEncryptFn).toHaveBeenCalledTimes(2)
    expect(mockedEncryptFn).toHaveBeenCalledWith({ id: 'valid_id' }, { expire: 3600 })
    expect(mockedEncryptFn).toHaveBeenCalledWith({ id: 'valid_id' }, { expire: 86400 })
    expect(response).toEqual(httpResponse(200, {
      accessToken: 'encrypted_access_token',
      refreshToken: 'encrypted_refresh_token',
    }))
  })
})
