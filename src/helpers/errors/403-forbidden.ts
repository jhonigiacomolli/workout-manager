import { CustomError } from './custom-error'

export class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden!') {
    super(403, message)
  }
}
