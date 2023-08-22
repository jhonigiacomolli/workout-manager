import { UnauthorizedError } from './401-unauthorized'

describe('UnauthorizedError', () => {
  it('Should have the correct values if no message provided', () => {
    const error = new UnauthorizedError()

    expect(error.statusCode).toBe(401)
    expect(error.message).toBe('Unauthorized!')
  })

  it('Should have the correct values id message is provided', () => {
    const error = new UnauthorizedError('Any other error message')

    expect(error.statusCode).toBe(401)
    expect(error.message).not.toBe('Unauthorized!')
    expect(error.message).toBe('Any other error message')
  })

  it('Should be an instance of Error', () => {
    const error = new UnauthorizedError()

    expect(error).toBeInstanceOf(Error)
  })
})
