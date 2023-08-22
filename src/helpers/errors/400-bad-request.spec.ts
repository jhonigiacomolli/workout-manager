import { BadRequestError } from './400-bad-request'

describe('BadRequestError', () => {
  it('Should have the correct values if no message provided', () => {
    const error = new BadRequestError()

    expect(error.statusCode).toBe(400)
    expect(error.message).toBe('Bad Request!')
  })

  it('Should have the correct values id message is provided', () => {
    const error = new BadRequestError('Any other error message')

    expect(error.statusCode).toBe(400)
    expect(error.message).not.toBe('Bad Request!')
    expect(error.message).toBe('Any other error message')
  })

  it('Should be an instance of Error', () => {
    const error = new BadRequestError()

    expect(error).toBeInstanceOf(Error)
  })
})
