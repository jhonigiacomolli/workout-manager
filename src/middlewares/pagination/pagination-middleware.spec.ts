import { Request, Response } from 'express'
import { pagination } from './pagination-middleware'

const fakeRequest: Partial<Request> = {
  query: {},
}

const fakeResponse: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
}

const fakeNext = jest.fn()

describe('PaginationMiddleWare', () => {
  test('Should inject default pagination params if no query param is provided', async () => {
    await pagination(fakeRequest as Request, fakeResponse as Response, fakeNext)
    expect(fakeRequest).toEqual({
      ...fakeRequest,
      query: {
        pagination: {
          limit: '10',
          page: '1',
          offset: '0',
          order: 'DESC',
          orderBy: 'id',
        },
      },
    })
    expect(fakeNext).toHaveBeenCalled()
  })
  test('Should inject correct pagination params if limit query param is provided', async () => {
    fakeRequest.query = {
      limit: '20',
      page: '2',
      offset: '20',
      order: 'ASC',
      orderBy: 'name',
    }

    await pagination(fakeRequest as Request, fakeResponse as Response, fakeNext)

    expect(fakeRequest).toEqual({
      ...fakeRequest,
      query: {
        ...fakeRequest.query,
        pagination: {
          limit: '20',
          page: '2',
          offset: '20',
          order: 'ASC',
          orderBy: 'name',
        },
      },
    })
  })
  test('Should inject correct pagination params if limit query param id -1', async () => {
    fakeRequest.query = {
      limit: '-1',
    }

    await pagination(fakeRequest as Request, fakeResponse as Response, fakeNext)

    expect(fakeRequest).toEqual({
      ...fakeRequest,
      query: {
        ...fakeRequest.query,
        pagination: {
          limit: undefined,
          page: '1',
          offset: undefined,
          order: 'DESC',
          orderBy: 'id',
        },
      },
    })
  })
})
