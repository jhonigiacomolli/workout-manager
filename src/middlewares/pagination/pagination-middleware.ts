import { validateNumberParams, validateTextParams } from '@/helpers/sanitize'
import { NextFunction, Request, Response } from 'express'

export const pagination = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  request.query.pagination = {
    limit: validateNumberParams(request.query.limit, '10'),
    page: validateNumberParams(request.query.page, '1'),
    order: validateTextParams(request.query.order, 'desc'),
    sort: validateTextParams(request.query.sort, 'id'),
  }

  if (request.query.limit === '-1') {
    request.query.pagination.limit = undefined
  }

  next()
}
