import { httpRequest } from '@/helpers/http'
import { HTTPRequest } from '@/protocols/models/http'

type FakeRequestOptions = {
  body?: any
  headers?: any
  params?: any
  query?: any
}

const fakeRequestHeaders = {
  authorization: 'Bearer any_valid_token',
}

const fakeRequestParams = {
  id: 'any_id',
}

export const fakePaginationDefault = {
  limit: '10',
  page: '1',
  offset: '0',
  order: 'DESC',
  orderBy: 'id',
}

const fakeRequestQuery = {
  pagination: fakePaginationDefault,
}

export const makeFakeRequest = (options?: FakeRequestOptions): HTTPRequest => ({
  ...httpRequest(
    options?.body || {},
    options?.headers || fakeRequestHeaders,
    options?.params || fakeRequestParams,
    options?.query || fakeRequestQuery,
  ),
})
