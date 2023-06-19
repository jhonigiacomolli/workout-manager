import { type Controller } from '@/protocols/models/controller'
import { type HTTPRequest, type HTTPResponse } from '@/protocols/models/http'
import { type Request, type Response } from 'express'

export const httpResponse = (statusCode: number, message: string | string[] | object): HTTPResponse => {
  return {
    statusCode,
    body: {
      message,
    },
  }
}

export const httpRequest = (content: any, header?: any): HTTPRequest => {
  return {
    headers: {
      ...header,
    },
    body: {
      ...content,
    },
  }
}

export const useRouteController = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpResponse = await controller.handle({ headers: req.headers, body: req.body })

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode < 300) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message,
      })
    }
  }
}
