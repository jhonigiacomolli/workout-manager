import { makeFakeRequest } from '@/mocks/http'
import { InvalidParamError } from '@/helpers/errors'
import { AccountStub } from '@/mocks/account/account-stub'
import { makeFakeAccount } from '@/mocks/account/account-fakes'
import { AccountLoadAllItemsController } from './load-all-accounts'

const makeSut = () => {
  const fakeRequest = makeFakeRequest()
  const accountStub = new AccountStub()
  const sut = new AccountLoadAllItemsController({
    account: accountStub,
  })

  return {
    sut,
    fakeRequest,
    accountStub,
  }
}

describe('AccountLoadAllItemsController', () => {
  test('Should return a list of teams', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual({
      statusCode: 200,
      body: [makeFakeAccount()],
    })
  })
  test('Should return a empty list of teams if not have entries on db', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()

    jest.spyOn(accountStub, 'getAllAccounts').mockReturnValueOnce(Promise.resolve([]))

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual({
      statusCode: 200,
      body: [],
    })
  })

  test('Should getAll method calls with corred params if invalid orderby param is provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const fakeRequestWithInvalidParam = {
      ...fakeRequest,
      query: {
        ...fakeRequest.query,
        pagination: {
          ...fakeRequest.query.pagination,
          orderBy: 'wrong',
        },
      },
    }

    const output = sut.handle(fakeRequestWithInvalidParam)

    await expect(output).rejects.toThrow(new InvalidParamError('orderBy, accepted params(id,name,email,phone,address,status)'))
  })
  test('Should getAllAccounts to have been called with correct params', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()

    const methodSpy = jest.spyOn(accountStub, 'getAllAccounts')

    await sut.handle(fakeRequest)

    expect(methodSpy).toHaveBeenCalledWith({
      limit: '10',
      page: '1',
      offset: '0',
      order: 'DESC',
      orderBy: 'id',
    })

    const fakeRequestWithDiffPagination = makeFakeRequest({
      query: {
        pagination: {
          limit: '4',
          page: '1',
          offset: '0',
          order: 'DESC',
          orderBy: 'id',
        },
      },
    })

    await sut.handle(fakeRequestWithDiffPagination)

    expect(methodSpy).toHaveBeenCalledWith({
      ...fakeRequest.query.pagination,
      order: 'DESC',
      orderBy: 'id',
      offset: '0',
    })
  })
  test('Should return throw if loadAll method throws', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()

    jest.spyOn(accountStub, 'getAllAccounts').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })
})
