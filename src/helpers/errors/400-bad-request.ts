import { CustomError } from './custom-error'

export class BadRequestError extends CustomError {
  constructor(message = 'Bad Request!') {
    super(400, message)
  }
}
