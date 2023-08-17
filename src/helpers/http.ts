import { type Controller } from '@/protocols/models/controller'
import { type HTTPRequest, type HTTPResponse } from '@/protocols/models/http'
import { type Request, type Response } from 'express'

export const httpResponse = (statusCode: number, body: string | string[] | object): HTTPResponse => {
  return {
    statusCode,
    body,
  }
}

export const httpRequest = (content: any, header?: any, params?: any, query?: any): HTTPRequest => {
  return {
    headers: {
      ...header,
    },
    params: {
      ...params,
    },
    query: {
      ...query,
    },
    body: {
      ...content,
    },
  }
}

export const useRouteController = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpResponse = await controller.handle({
      headers: { ...req.headers },
      params: { ...req.params },
      query: { ...req.query },
      body: { ...req.body },
    })

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode < 300) {
      if (typeof httpResponse.body === 'string') {
        res.status(httpResponse.statusCode).json({
          message: httpResponse.body,
        })
      } else {
        res.status(httpResponse.statusCode).json(httpResponse.body)
      }
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body,
      })
    }
  }
}
