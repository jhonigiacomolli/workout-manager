import { File } from './file'

export type HTTPRequestParams = {
  [key: string]: any
  host?: string
  page?: string
  limit?: string
  orderBy?: string
  order?: string
}

export type HTTPPaginationAndOrderParams = {
  limit: string
  orderBy: string
  order: string
  offset: string
  startAt?: string
  startEnd?: string
}

export type HTTPRequest = {
  body: any
  params: HTTPRequestParams
  query: HTTPRequestParams
  headers: any
  files: any
  baseUrl: string
}

export type HTTPResponse = {
  statusCode: number
  body: any
}

export type RepositoryRequest<TYPE> = TYPE & {
  files: {
    [key: string]: File
  }
}
