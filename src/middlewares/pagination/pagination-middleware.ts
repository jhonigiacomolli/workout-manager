import { NextFunction, Request, Response } from 'express'
import { validateNumberParams, validateOrderParams, validateTextParams } from '@/helpers/sanitize'

export const pagination = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  const numericPage = Number(request.query.page)
  const page = (numericPage === 0) ? 0 : (numericPage - 1)
  const limit = Number(request.query.limit)
  const offset = page * limit || '0'

  request.query.pagination = {
    limit: validateNumberParams(request.query.limit, '10'),
    page: validateNumberParams(request.query.page, '1'),
    offset: offset.toString(),
    order: validateOrderParams(request.query.order),
    orderBy: validateTextParams(request.query.orderBy, 'id'),
  }

  if (request.query.limit === '-1') {
    request.query.pagination.limit = undefined
    request.query.pagination.offset = undefined
  }

  if (!request.query.pagination.order) {
    response.status(400).json({
      error: 'Invalid param: order, accepted values(asc,desc)',
    })
    return
  }

  next()
}
