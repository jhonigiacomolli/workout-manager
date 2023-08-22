import { NotFoundError, UnauthorizedError } from '@/helpers/errors'
import { ErrorLogController } from './error-log-controller'
import { ErrorLog } from '@/protocols/use-cases/log/error-log'

class ErrorLogRepositoryStub implements ErrorLog {
  async save() { console.log() }
}

jest.useFakeTimers().setSystemTime(new Date('8/22/2023, 12:00:00 AM'))

const errorLogrepositoryStub = new ErrorLogRepositoryStub()

describe('LogController', () => {
  test('Should calls save method of repository with internal server error values when throws generic error', () => {
    const error = new Error('Any generic error')
    const controller = new ErrorLogController(errorLogrepositoryStub)
    const repositorySpy = jest.spyOn(errorLogrepositoryStub, 'save')

    controller.handle(error)

    expect(repositorySpy).toHaveBeenCalledWith({
      statusCode: 500,
      date: '8/22/2023, 12:00:00 AM',
      message: error.message,
      stack: error.stack?.split('at')[1].trim(),
    })
  })
  test('Should calls save method of repository with custom error values when throws specific error', () => {
    const notfoundError = new NotFoundError()
    const controller = new ErrorLogController(errorLogrepositoryStub)
    const repositorySpy = jest.spyOn(errorLogrepositoryStub, 'save')

    controller.handle(notfoundError)

    expect(repositorySpy).toHaveBeenCalledWith({
      statusCode: 404,
      date: '8/22/2023, 12:00:00 AM',
      message: notfoundError.message,
      stack: notfoundError.stack?.split('at')[1].trim(),
    })

    const unautorizedError = new UnauthorizedError()

    controller.handle(unautorizedError)

    expect(repositorySpy).toHaveBeenCalledWith({
      statusCode: 401,
      date: '8/22/2023, 12:00:00 AM',
      message: unautorizedError.message,
      stack: unautorizedError.stack?.split('at')[1].trim(),
    })
  })
  test('Should calls save method of repository with empty stack message if prop is undefined', () => {
    const notfoundError = new NotFoundError()
    const controller = new ErrorLogController(errorLogrepositoryStub)
    const repositorySpy = jest.spyOn(errorLogrepositoryStub, 'save')

    delete notfoundError.stack

    controller.handle(notfoundError)

    expect(repositorySpy).toHaveBeenCalledWith({
      statusCode: 404,
      date: '8/22/2023, 12:00:00 AM',
      message: notfoundError.message,
      stack: '',
    })
  })
})
