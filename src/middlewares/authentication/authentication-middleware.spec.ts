import { Request, Response } from 'express'
import { authenticate } from './authentication-middleware'
import { AccountStub } from '@/mocks/account/account-stub'
import { EncrypterStub } from '@/mocks/cryptography/encrypter-stub'
import { makeFakeAccount } from '@/mocks/account/account-fakes'

const fakeRequest = {
  headers: {
    authorization: 'Bearer valid_access_token',
  },
  params: {},
} as Request

const fakeRequestNoBearer = {
  headers: {
    authorization: 'valid_access_token',
  },
  params: {},
} as Request

const fakeRequestWithoutToken = {
  headers: {},
  params: {},
} as Request

const fakeResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response

const fakeNext = jest.fn()

const accountStub = new AccountStub()
const encrypterStub = new EncrypterStub()

describe('Authentication Middleware', () => {
  test('Should return 401 if access token is not provided', async () => {
    await authenticate(fakeRequestWithoutToken, fakeResponse, fakeNext, accountStub, encrypterStub)
    expect(fakeResponse.status).toHaveBeenCalledWith(401)
    expect(fakeResponse.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
    })
  })
  test('Should return 401 if access token is not a bearer token', async () => {
    await authenticate(fakeRequestNoBearer, fakeResponse, fakeNext, accountStub, encrypterStub)
    expect(fakeResponse.status).toHaveBeenCalledWith(401)
    expect(fakeResponse.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
    })
  })
  test('Should return 401 if access token is expired', async () => {
    jest.spyOn(encrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve({
      data: undefined,
      status: { success: false, message: 'Expired token' },
    }))
    await authenticate(fakeRequest, fakeResponse, fakeNext, accountStub, encrypterStub)
    expect(fakeResponse.status).toHaveBeenCalledWith(401)
    expect(fakeResponse.json).toHaveBeenCalledWith({
      error: 'Expired token',
    })
  })
  test('Should return 401 if invalid token', async () => {
    jest.spyOn(encrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve({
      data: {},
      status: { success: true, message: '' },
    }))
    await authenticate(fakeRequest, fakeResponse, fakeNext, accountStub, encrypterStub)

    expect(fakeResponse.status).toHaveBeenCalledWith(401)
    expect(fakeResponse.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
    })
  })
  test('Should return 401 if id included on token not to belong a any user', async () => {
    jest.spyOn(accountStub, 'getUserById').mockImplementationOnce(() => Promise.resolve(undefined))

    await authenticate(fakeRequest, fakeResponse, fakeNext, accountStub, encrypterStub)

    expect(accountStub.getUserById).toHaveBeenCalled()
    expect(accountStub.getUserById).toHaveBeenCalledWith(makeFakeAccount().id)
    expect(fakeResponse.status).toHaveBeenCalledWith(401)
    expect(fakeResponse.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
    })
  })
  test('Should return 200 if access token is authenticated', async () => {
    await authenticate(fakeRequest, fakeResponse, fakeNext, accountStub, encrypterStub)

    expect(fakeNext).toHaveBeenCalled()
  })
})
