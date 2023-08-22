import { NotFoundError } from './404-not-found'

describe('NotFoundError', () => {
  it('Should have the correct values if no message provided', () => {
    const error = new NotFoundError()

    expect(error.statusCode).toBe(404)
    expect(error.message).toBe('Not Found!')
  })

  it('Should have the correct values id message is provided', () => {
    const error = new NotFoundError('Any other error message')

    expect(error.statusCode).toBe(404)
    expect(error.message).not.toBe('Not Found!')
    expect(error.message).toBe('Any other error message')
  })

  it('Should be an instance of Error', () => {
    const error = new NotFoundError()

    expect(error).toBeInstanceOf(Error)
  })
})
