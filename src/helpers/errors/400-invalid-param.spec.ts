import { InvalidParamError } from './400-invalid-param'

describe('InvalidParamError', () => {
  it('Should have the correct values if no message provided', () => {
    const error = new InvalidParamError()

    expect(error.statusCode).toBe(400)
    expect(error.message).toBe('Invalid param!')
  })

  it('Should have the correct values id message is provided', () => {
    const error = new InvalidParamError('user')

    expect(error.statusCode).toBe(400)
    expect(error.message).toBe('Invalid param: user')
  })

  it('Should be an instance of Error', () => {
    const error = new InvalidParamError()

    expect(error).toBeInstanceOf(Error)
  })
})
