import { CustomError } from './custom-error'
describe('CustomError', () => {
  it('should have the correct statusCode and message', () => {
    const statusCode = 404
    const errorMessage = 'Not Found'

    const error = new CustomError(statusCode, errorMessage)

    expect(error.statusCode).toEqual(statusCode)
    expect(error.message).toEqual(errorMessage)
  })

  it('should be an instance of Error', () => {
    const error = new CustomError(500, 'Internal Server Error')

    expect(error).toBeInstanceOf(Error)
  })
})
