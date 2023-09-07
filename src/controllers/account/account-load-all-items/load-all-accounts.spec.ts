import { httpRequest } from '@/helpers/http'
import { AccountStub } from '@/mocks/account/account-stub'
import { AccountLoadAllItemsController } from './load-all-accounts'
import { makeFakeAccount } from '@/mocks/account/account-fakes'
import { InvalidParamError } from '@/helpers/errors'

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
  const sut = new AccountLoadAllItemsController({
    account: accountStub,
  })

  return {
    sut,
    accountStub,
  }
}

describe('AccountLoadAllItemsController', () => {
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
  test('Should getAll method calls with corred params if invalid orderby param is provided', async () => {
    const { sut } = makeSut()

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
  })
  test('Should return throw if loadAll method throws', async () => {
    const { sut, accountStub } = makeSut()

    jest.spyOn(accountStub, 'getAllAccounts').mockImplementationOnce(() => { throw new Error() })

    const result = sut.handle(fakeRequest)

    await expect(result).rejects.toThrow()
  })
})
