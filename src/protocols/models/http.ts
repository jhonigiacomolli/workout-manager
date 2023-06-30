export type HTTPRequestParams = {
  [key: string]: any
  host?: string
  page?: string
  limit?: string
  orderBy?: string
  order?: string
}

export type HTTPPaginationAndOrderParams = {
  page?: string
  limit?: string
  orderBy?: string
  order?: string
  startAt?: string
  startEnd?: string
}

export type HTTPRequest = {
  body: any
  params: HTTPRequestParams
  query: HTTPRequestParams
  headers: any
}

export type HTTPResponse = {
  statusCode: number
  body: any
}
