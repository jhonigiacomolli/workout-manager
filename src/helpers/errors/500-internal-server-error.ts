import { CustomError } from './custom-error'

export class InternalServerError extends CustomError {
  constructor(message = 'Internal Server Error') {
    super(500, message)
  }
}
