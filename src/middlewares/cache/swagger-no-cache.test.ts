import request from 'supertest'
import express from 'express'
import { swaggerNoCache } from './swagger-no-cache'

const app = express()
app.use(swaggerNoCache)

test('Teste middleware swaggerNoCache', async () => {
  const response = await request(app).get('/')

  expect(response.header['cache-control']).toBe('no-store, no-cache, must-revalidate, proxy-revalidate')
  expect(response.header.pragma).toBe('no-cache')
  expect(response.header.expires).toBe('0')
  expect(response.header['surrogate-control']).toBe('no-store')
})
