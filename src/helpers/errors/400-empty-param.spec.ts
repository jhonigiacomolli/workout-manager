import { EmptyParamError } from './400-empty-param'

describe('EmptyParamError', () => {
  it('Should have the correct values if no message provided', () => {
    const error = new EmptyParamError()

    expect(error.statusCode).toBe(400)
    expect(error.message).toBe('Empty required param')
  })

  it('Should have the correct values id message is provided', () => {
    const error = new EmptyParamError('user')

    expect(error.statusCode).toBe(400)
    expect(error.message).toBe('Empty param: user is required')
  })

  it('Should be an instance of Error', () => {
    const error = new EmptyParamError()

    expect(error).toBeInstanceOf(Error)
  })
})
