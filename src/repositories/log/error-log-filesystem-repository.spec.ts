import fs from 'fs/promises'
import path from 'path'

import { ErrorLogInput } from '@/protocols/models/log/error-log'
import { ErrorLogFileSystemRepository } from './error-log-filesystem-repository'

jest.mock('fs', () => ({
  appendFile: jest.fn((filePath, data, callback) => {
    callback(null)
  }),
}))

describe('FileSistemErrorLogRepository', () => {
  test('Should salve log on file error-log.txt', () => {
    const errorLogRepository = new ErrorLogFileSystemRepository()

    const input: ErrorLogInput = {
      date: '8/22/2023',
      statusCode: 500,
      message: 'Internal Server Error',
      stack: 'any stack message provided by error',
    }

    const fsSpy = jest.spyOn(fs, 'appendFile')

    errorLogRepository.save(input)

    const errorMessageDivider = '-----------------------------------------------\n'
    const errorMessageDate = 'New 500 error: 8/22/2023\n'
    const errorMessageTitle = 'Message: Internal Server Error\n'
    const errorMessageLocation = 'Location: any stack message provided by error\n'
    const errorMessage = errorMessageDivider + errorMessageDate + errorMessageTitle + errorMessageLocation + errorMessageDivider

    expect(fsSpy).toHaveBeenCalled()
    expect(fsSpy).toHaveBeenCalledWith(path.resolve('./error-log.txt'), errorMessage)
  })
})
