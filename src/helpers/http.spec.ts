import { httpRequest, httpResponse, useRouteController } from './http'

describe('http', () => {
  describe('httpRequest', () => {
    test('Should return a valid http request value', () => {
      const response = httpRequest({ message: 'any_content' })
      expect(response).toEqual({
        headers: {},
        body: {
          message: 'any_content',
        },
      })
    })
  })

  describe('httpResponse', () => {
    test('Should return a valid http response value', () => {
      const response = httpResponse(200, 'success_message')
      expect(response).toEqual({
        statusCode: 200,
        body: {
          message: 'success_message',
        },
      })
    })
    test('Should return a valid http response value on error cases', () => {
      const response = httpResponse(500, 'error_message')
      expect(response).toEqual({
        statusCode: 500,
        body: {
          message: 'error_message',
        },
      })
    })
  })

  describe('useRouteController', () => {
    let controller: any
    let req: any
    let res: any

    beforeEach(() => {
      controller = {
        handle: jest.fn(),
      }
      req = {
        // mock your req object properties and methods here
      }
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

    it('should return error response if statusCode is greather then 300', async () => {
      const httpResponse = {
        statusCode: 300,
        body: { message: 'Bad Request' },
      }
      controller.handle.mockResolvedValue(httpResponse)

      const routeController = useRouteController(controller)
      await routeController(req, res)

      expect(res.status).toHaveBeenCalledWith(httpResponse.statusCode)
      expect(res.json).toHaveBeenCalledWith({ error: httpResponse.body.message })
    })

    it('should return error response if statusCode is greather then 400', async () => {
      const httpResponse = {
        statusCode: 400,
        body: { message: 'Bad Request' },
      }
      controller.handle.mockResolvedValue(httpResponse)

      const routeController = useRouteController(controller)
      await routeController(req, res)

      expect(res.status).toHaveBeenCalledWith(httpResponse.statusCode)
      expect(res.json).toHaveBeenCalledWith({ error: httpResponse.body.message })
    })
  })
})
