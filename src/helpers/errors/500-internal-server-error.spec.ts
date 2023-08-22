import { InternalServerError } from './500-internal-server-error'
describe('InternalServerErrror', () => {
  it('Should have the correct values if no message provided', () => {
    const error = new InternalServerError()

    expect(error.statusCode).toBe(500)
    expect(error.message).toBe('Internal Server Error')
  })

  it('Should have the correct values id message is provided', () => {
    const error = new InternalServerError('Any other error message')

    expect(error.statusCode).toBe(500)
    expect(error.message).not.toBe('Internal Server Error')
    expect(error.message).toBe('Any other error message')
  })

  it('Should be an instance of Error', () => {
    const error = new InternalServerError()

    expect(error).toBeInstanceOf(Error)
  })
})
