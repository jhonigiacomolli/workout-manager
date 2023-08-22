import { httpRequest, httpResponse, useRouteController } from './http'

describe('http', () => {
  describe('httpRequest', () => {
    test('Should return a valid http request value', () => {
      const response = httpRequest({ message: 'any_content' })
      expect(response).toEqual({
        headers: {},
        params: {},
        query: {},
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
        body: 'success_message',
      })
    })
    test('Should return a valid http response value on error cases', () => {
      const response = httpResponse(500, 'error_message')
      expect(response).toEqual({
        statusCode: 500,
        body: 'error_message',
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
  })
})
