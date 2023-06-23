import { httpRequest, httpResponse } from '@/helpers/http'
import { AccountStub } from '@/mocks/account/account-stub'
import { makeFakeAccount } from '@/mocks/account/make-fake-account'
import { AccountUdateController } from './account-update-controller'

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

  const sut = new AccountUdateController({
    account: accountStub,
  })

  return {
    sut,
    accountStub,
    fakeRequest,
  }
}

describe('Account Update Controller', () => {
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
