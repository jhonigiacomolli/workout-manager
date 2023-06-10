import { Controller } from "@/protocols/models/controller"
import { HTTPRequest, HTTPResponse } from "@/protocols/models/http"
import { Request, Response } from "express"

export const httpResponse = (statusCode: number, message: any): HTTPResponse => {
  return {
    statusCode,
    body: {
      message,
    },
  }
}

export const httpRequest = (content: any): HTTPRequest => {
  return {
    body: {
      ...content
    }
  }
}

export const useRouteController = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpResponse = await controller.handle({...req})

    if(httpResponse.statusCode >=200 && httpResponse.statusCode < 300) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
