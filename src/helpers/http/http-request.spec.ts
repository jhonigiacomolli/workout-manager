import { httpRequest } from './http-request'

describe('httpRequest', () => {
  test('Should return a valid http request value', () => {
    const response = httpRequest({ message: 'any_content' })
    expect(response).toEqual({
      headers: {},
      params: {},
      query: {},
      body: {
        message: 'any_content',
      },
      files: {},
    })
  })
  test('Should return a valid http request value if headers provided', () => {
    const response = httpRequest({}, { authorization: 'any_token' })
    expect(response).toEqual({
      headers: {
        authorization: 'any_token',
      },
      params: {},
      query: {},
      body: {},
      files: {},
    })
  })
})
