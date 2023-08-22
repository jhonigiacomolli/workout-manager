import { CustomError } from './custom-error'

export class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized!') {
    super(401, message)
  }
}
