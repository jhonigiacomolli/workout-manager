import { CustomError } from './custom-error'

export class NotFoundError extends CustomError {
  constructor(message = 'Not Found!') {
    super(404, message)
  }
}
