import { HTTPResponse } from '@/protocols/models/http'

export const httpResponse = (statusCode: number, body: string | string[] | object): HTTPResponse => {
  return {
    statusCode,
    body,
  }
}
