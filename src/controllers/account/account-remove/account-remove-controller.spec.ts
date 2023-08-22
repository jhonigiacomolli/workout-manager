import { AccountStub } from '@/mocks/account/account-stub'
import { AccountRemoveController } from './account-remove-controller'
import { httpRequest, httpResponse } from '@/helpers/http'
import { BadRequestError } from '@/helpers/errors'

const body = {}
const headers = {
  authorization: 'valid_access_token',
}

const fakeRequest = httpRequest(body, headers, { id: 'any_account_id' })

const makeSut = () => {
  const accountStub = new AccountStub()
  const sut = new AccountRemoveController({
    account: accountStub,
  })

  return {
    sut, accountStub,
  }
}

describe('Account Remove Controller', () => {
  test('Should return 200 if account is removed', async () => {
    const { sut } = makeSut()

    const result = await sut.handle(fakeRequest)

    expect(result).toEqual(httpResponse(204, 'User removed'))
  })
  test('Should return 400 if no account id is provided with param', async () => {
    const { sut } = makeSut()

    const wrongFakeRequest = { ...fakeRequest }
    wrongFakeRequest.params = {}

    const result = sut.handle(wrongFakeRequest)

    await expect(result).rejects.toThrow(new BadRequestError('Empty param: id is required'))
  })
  test('Should return 400 if no account delete method return false', async () => {
    const { sut, accountStub } = makeSut()

    jest.spyOn(accountStub, 'delete').mockReturnValueOnce(Promise.resolve(false))

    const result = sut.handle(fakeRequest)

    await expect(result).rejects.toThrow(new BadRequestError('User removal failed'))
  })
  test('Should return 500 if any method throws', async () => {
    const { sut, accountStub } = makeSut()

    jest.spyOn(accountStub, 'delete').mockImplementationOnce(() => { throw new Error() })

    const result = sut.handle(fakeRequest)

    await expect(result).rejects.toThrow()
  })
})
