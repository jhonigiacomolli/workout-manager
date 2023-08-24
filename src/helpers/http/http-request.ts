import { HTTPRequest } from '@/protocols/models/http'

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
