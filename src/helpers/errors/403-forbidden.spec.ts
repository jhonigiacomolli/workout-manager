import { ForbiddenError } from './403-forbidden'

describe('ForbiddenError', () => {
  it('Should have the correct values if no message provided', () => {
    const error = new ForbiddenError()

    expect(error.statusCode).toBe(403)
    expect(error.message).toBe('Forbidden!')
  })

  it('Should have the correct values id message is provided', () => {
    const error = new ForbiddenError('Any other error message')

    expect(error.statusCode).toBe(403)
    expect(error.message).not.toBe('Forbidden!')
    expect(error.message).toBe('Any other error message')
  })

  it('Should be an instance of Error', () => {
    const error = new ForbiddenError()

    expect(error).toBeInstanceOf(Error)
  })
})
