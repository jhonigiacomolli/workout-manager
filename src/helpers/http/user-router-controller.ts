import { type Request, type Response } from 'express'
import { type Controller } from '@/protocols/models/controller'

import { CustomError } from '../errors/custom-error'
import { ErrorLogController } from '@/controllers/log/error-log-controller'
import { ErrorLogFileSystemRepository } from '@/repositories/log/error-log-filesystem-repository'

export const useRouteController = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    try {
      const httpResponse = await controller.handle({
        headers: { ...req.headers },
        params: { ...req.params },
        query: { ...req.query },
        body: { ...req.body },
      })

      if (typeof httpResponse.body === 'string') {
        res.status(httpResponse.statusCode).json({
          message: httpResponse.body,
        })
      } else {
        res.status(httpResponse.statusCode).json(httpResponse.body)
      }
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          error: error.message,
        })
      } else {
        const logRepository = new ErrorLogFileSystemRepository()
        const logController = new ErrorLogController(logRepository)

        logController.handle(error)

        res.status(500).json({
          error: 'Internal Server Error',
        })
      }
    }
  }
}
