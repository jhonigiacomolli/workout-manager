import { HTTPRequest } from '@/protocols/models/http'

export const httpRequest = (content: any, header?: any, params?: any, query?: any, files?: any, baseUrl?: string): HTTPRequest => {
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
    files: {
      ...files,
    },
    baseUrl: baseUrl || '',
  }
}
