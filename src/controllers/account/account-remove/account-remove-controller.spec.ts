import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { AccountStub } from '@/mocks/account/account-stub'
import { BadRequestError, EmptyParamError } from '@/helpers/errors'
import { AccountRemoveController } from './account-remove-controller'

const makeSut = () => {
  const fakeRequest = makeFakeRequest()
  const accountStub = new AccountStub()
  const sut = new AccountRemoveController({
    account: accountStub,
  })

  return {
    sut,
    fakeRequest,
    accountStub,
  }
}

describe('Account Remove Controller', () => {
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
