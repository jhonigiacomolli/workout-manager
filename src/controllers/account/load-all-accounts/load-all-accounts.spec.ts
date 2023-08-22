import { httpRequest } from '@/helpers/http'
import { AccountStub } from '@/mocks/account/account-stub'
import { LoadAllAccountsController } from './load-all-accounts'
import { makeFakeAccount } from '@/mocks/account/make-fake-account'

const fakeRequest = httpRequest({}, {}, {}, {
  pagination: {
    limit: '10',
    page: '1',
    offset: '0',
    order: 'DESC',
    orderBy: 'id',
  },
})

const makeSut = () => {
  const accountStub = new AccountStub()
  const sut = new LoadAllAccountsController({
    account: accountStub,
  })

  return {
    sut,
    accountStub,
  }
}

describe('LoadAllAccountsController', () => {
  test('Should return a list of teams', async () => {
    const { sut } = makeSut()

    const result = await sut.handle(fakeRequest)

    expect(result).toEqual({
      statusCode: 200,
      body: [makeFakeAccount()],
    })
  })
  test('Should return a empty list of teams if not have entries on db', async () => {
    const { sut, accountStub } = makeSut()

    jest.spyOn(accountStub, 'getAllAccounts').mockReturnValueOnce(Promise.resolve([]))

    const result = await sut.handle(fakeRequest)

    expect(result).toEqual({
      statusCode: 200,
      body: [],
    })
  })
  test('Should getAllAccounts to have been called with correct params', async () => {
    const { sut, accountStub } = makeSut()

    const methodSpy = jest.spyOn(accountStub, 'getAllAccounts')
    await sut.handle(fakeRequest)

    expect(methodSpy).toHaveBeenCalledWith({
      limit: '10',
      page: '1',
      offset: '0',
      order: 'DESC',
      orderBy: 'id',
    })

    fakeRequest.query.pagination.limit = '4'
    fakeRequest.query.pagination.page = '1'

    await sut.handle(fakeRequest)

    expect(methodSpy).toHaveBeenCalledWith({
      ...fakeRequest.query.pagination,
      order: 'DESC',
      orderBy: 'id',
      offset: '0',
    })

    fakeRequest.query.pagination.orderBy = 'wrong_field'

    await sut.handle(fakeRequest)

    expect(methodSpy).toHaveBeenCalledWith({
      ...fakeRequest.query.pagination,
      orderBy: 'name',
    })
  })
  test('Should return throw if loadAll method throws', async () => {
    const { sut, accountStub } = makeSut()

    jest.spyOn(accountStub, 'getAllAccounts').mockImplementationOnce(() => { throw new Error() })

    const result = sut.handle(fakeRequest)

    await expect(result).rejects.toThrow()
  })
})
