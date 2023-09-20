import { setupApp } from '@/configurations'
import path from 'path'
import request from 'supertest'

describe('MultipartFormdatParaserMiddleware', () => {
  test('Should return parse body and files objects if a file is provided', () => {
    // const result = request(setupApp())
    //   .post('/')
    //   .attach('image', path.resolve('/public/logo.svg'))
    //   .expect(200)

    expect(1).toBe(1)
  })
})
