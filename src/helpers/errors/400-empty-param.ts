import { CustomError } from './custom-error'

export class EmptyParamError extends CustomError {
  constructor(param = '') {
    super(400, param ? `Empty param: ${param} is required` : 'Empty required param')
  }
}
