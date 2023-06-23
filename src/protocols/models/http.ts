export interface HTTPRequest {
  body?: any
  params?: any
  headers?: any
  header?: any
}

export interface HTTPResponse {
  statusCode: number
  body: any
}
