import { CustomError } from '@/helpers/errors/custom-error'
import { ErrorLog } from '@/protocols/use-cases/log/error-log'

export class ErrorLogController {
  constructor(private readonly controller: ErrorLog) { }

  async handle(error: Error | CustomError): Promise<void> {
    const input = {
      message: error.message,
      date: new Date().toLocaleString(),
      statusCode: error instanceof CustomError ? error.statusCode : 500,
      stack: error.stack?.split('at')[1].trim() || '',
    }

    this.controller.save(input)
  }
}
