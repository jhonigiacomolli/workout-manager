import { NotFoundError, UnauthorizedError } from '../errors'
import { httpResponse, useRouteController } from '.'

jest.mock('@/controllers/log/error-log-controller')

describe('useRouteController', () => {
  let controller: any
  let req: any
  let res: any

  beforeEach(() => {
    controller = {
      handle: jest.fn(),
    }
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return successful response if statusCode is between 200', async () => {
    const httpResponse = {
      statusCode: 200,
      body: { data: 'Success' },
    }
    controller.handle.mockResolvedValue(httpResponse)

    const routeController = useRouteController(controller)
    await routeController(req, res)

    expect(res.status).toHaveBeenCalledWith(httpResponse.statusCode)
    expect(res.json).toHaveBeenCalledWith(httpResponse.body)
  })

  it('should return error response if message prop when status code is lower then 400 and body is a string', async () => {
    const httpResponse = {
      statusCode: 200,
      body: 'Success message',
    }
    controller.handle.mockResolvedValue(httpResponse)

    const routeController = useRouteController(controller)
    await routeController(req, res)

    expect(res.status).toHaveBeenCalledWith(httpResponse.statusCode)
    expect(res.json).toHaveBeenCalledWith({ message: httpResponse.body })
  })

  it('should return successful response if statusCode is between 299', async () => {
    const httpResponse = {
      statusCode: 299,
      body: { data: 'Success' },
    }
    controller.handle.mockResolvedValue(httpResponse)

    const routeController = useRouteController(controller)
    await routeController(req, res)

    expect(res.status).toHaveBeenCalledWith(httpResponse.statusCode)
    expect(res.json).toHaveBeenCalledWith(httpResponse.body)
  })

  it('should return and custom internal server error response if any methods throw a generic error', async () => {
    jest.spyOn(controller, 'handle').mockImplementationOnce(() => { throw new Error('') })
    controller.handle.mockResolvedValue(httpResponse)

    const routeController = useRouteController(controller)
    await routeController(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
    })
  })

  it('should return and custom error response if any methods throw a NotFoundError', async () => {
    jest.spyOn(controller, 'handle').mockImplementationOnce(() => { throw new NotFoundError() })
    controller.handle.mockResolvedValue(httpResponse)

    const routeController = useRouteController(controller)
    await routeController(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Not Found!',
    })
  })

  it('should return and custom error response if any methods throw a UnauthorizedError', async () => {
    jest.spyOn(controller, 'handle').mockImplementationOnce(() => { throw new UnauthorizedError() })
    controller.handle.mockResolvedValue(httpResponse)

    const routeController = useRouteController(controller)
    await routeController(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized!',
    })
  })

  test('Should invalid param error when postgres throw a uuid error', async () => {
    jest.spyOn(controller, 'handle').mockImplementationOnce(() => {
      const error = new Error('') as any
      error.code = '22P02'
      throw error
    })
    controller.handle.mockResolvedValue(httpResponse)

    const routeController = useRouteController(controller)
    await routeController(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid param: id',
    })
  })
})
