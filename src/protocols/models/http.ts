export type HTTPRequestParams = {
  [key: string]: string | undefined
  host?: string
  page?: string
  limit?: string
  sort?: string
  order?: string
}

export type HTTPRequest = {
  body: any
  params: HTTPRequestParams
  headers: any
}

export type HTTPResponse = {
  statusCode: number
  body: any
}
