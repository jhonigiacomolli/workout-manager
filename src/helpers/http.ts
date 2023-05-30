import { HTTPRequest, HTTPResponse } from "@/protocols/models/http"

export const httpError = (statusCode: number, message: string): HTTPResponse => {
  return {
    statusCode,
    body: new Error(message)
  }
}

export const httpResponse = (statusCode: number, body: any): HTTPResponse => {
  return {
    statusCode,
    body,
  }
}

export const httpRequest = (content: any): HTTPRequest => {
  return {
    body: {
      ...content
    }
  }
}
