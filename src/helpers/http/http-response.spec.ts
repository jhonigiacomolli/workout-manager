import { httpResponse } from './http-response'

describe('httpResponse', () => {
  test('Should return a valid http response value', () => {
    const response = httpResponse(200, 'success_message')
    expect(response).toEqual({
      statusCode: 200,
      body: 'success_message',
    })
  })
  test('Should return a valid http response value on error cases', () => {
    const response = httpResponse(500, 'error_message')
    expect(response).toEqual({
      statusCode: 500,
      body: 'error_message',
    })
  })
})
