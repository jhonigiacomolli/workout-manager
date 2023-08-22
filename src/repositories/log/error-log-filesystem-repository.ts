import path from 'path'
import fs from 'fs/promises'
import { ErrorLogInput } from '@/protocols/models/log/error-log'
import { ErrorLog } from '@/protocols/use-cases/log/error-log'

export class ErrorLogFileSystemRepository implements ErrorLog {
  async save(input: ErrorLogInput) {
    const errorMessageDivider = '-----------------------------------------------\n'
    const errorMessageDate = `New ${input.statusCode} error: ${input.date}\n`
    const errorMessageTitle = `Message: ${input.message}\n`
    const errorMessageLocation = `Location: ${input.stack}\n`
    const errorMessage = errorMessageDivider + errorMessageDate + errorMessageTitle + errorMessageLocation + errorMessageDivider

    fs.appendFile(path.resolve('./error-log.txt'), errorMessage.trimStart())
  }
}
