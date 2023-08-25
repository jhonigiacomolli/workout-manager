import { CustomError } from './custom-error'

export class InvalidParamError extends CustomError {
  constructor(param = '') {
    super(400, param ? `Invalid param: ${param}` : 'Invalid param!')
  }
}
