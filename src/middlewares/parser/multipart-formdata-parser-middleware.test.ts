import request from 'supertest'
import express, { Request, json } from 'express'
import { multiPartFormDataParser } from './multipart-formdata-parser-middleware'
import { RepositoryRequest } from '@/protocols/models/http'
import Utils from 'superagent/lib/utils'

const UtilsType = Utils.type
Utils.type = function (type) {
  if (type === 'multipart/form-data; charset=utf-8') {
    type = 'application/json; charset=utf-8'
  }
  return UtilsType.call(this, type)
}

const app = express()

app.use(json())
app.use(multiPartFormDataParser)

app.post('/any-route', (req: RepositoryRequest<Request>, res) => {
  res.status(200).json({
    body: req.body,
    files: req.files,
  })
})
app.get('/any-route', (req, res) => {
  res.status(200).send()
})

describe('MultipartFormdatParaserMiddleware', () => {
  test('Should return parse body if content type is multipart/form-data but do not have files attached', async () => {
    const output = await request(app)
      .post('/any-route')
      .set('content-type', 'multipart/form-data')
      .field('name', 'any-name')
      .field('email', 'any-email')
      .expect(200)

    expect(output.body.body).toEqual({
      name: 'any-name',
      email: 'any-email',
    })
  })

  test('Should return parse body if content type is multipart/form-data if have files attached', async () => {
    const output = await request(app)
      .post('/any-route')
      .set('content-type', 'multipart/form-data')
      .field('name', 'any-name')
      .field('email', 'any-email')
      .attach('image', 'public/logo.svg')
      .expect(200)

    expect(output.body.body).toEqual({
      name: 'any-name',
      email: 'any-email',
    })
    expect(output.body.files.image.filename).toBe('logo.svg')
    expect(output.body.files.image.extension).toBe('svg')
    expect(output.body.files.image.mime).toBe('image/svg+xml')
  })

  test('Should return parse body if content type is multipart/form-data if have an array of files attached', async () => {
    const output = await request(app)
      .post('/any-route')
      .set('content-type', 'multipart/form-data')
      .field('name', 'any-name')
      .field('email', 'any-email')
      .attach('images[]', 'public/logo.svg')
      .attach('images[]', 'public/logo.svg')
      .expect(200)

    expect(output.body.body).toEqual({
      name: 'any-name',
      email: 'any-email',
    })
    expect(Array.isArray(output.body.files.images)).toBeTruthy()
    expect(output.body.files.images[0].filename).toBe('logo.svg')
    expect(output.body.files.images[0].extension).toBe('svg')
    expect(output.body.files.images[0].mime).toBe('image/svg+xml')
  })

  test('Should return parse body if content type is multipart/form-data if have an array with only one file attached', async () => {
    const output = await request(app)
      .post('/any-route')
      .set('content-type', 'multipart/form-data')
      .field('name', 'any-name')
      .field('email', 'any-email')
      .attach('images[]', 'public/logo.svg')
      .expect(200)

    expect(output.body.body).toEqual({
      name: 'any-name',
      email: 'any-email',
    })
    expect(Array.isArray(output.body.files.images)).toBeTruthy()
    expect(output.body.files.images[0].filename).toBe('logo.svg')
    expect(output.body.files.images[0].extension).toBe('svg')
    expect(output.body.files.images[0].mime).toBe('image/svg+xml')
  })

  test('Should return parse body and files correctly if a simple request', async () => {
    const output = await request(app)
      .post('/any-route')
      .set('Content-Type', 'application/json')
      .send({
        name: 'any-name',
        email: 'any-email',
      })
      .expect(200)

    expect(output.body.body).toEqual({
      name: 'any-name',
      email: 'any-email',
    })
    expect(output.body.files).toBeFalsy()
  })

  test('Should return a empry array if empty string array if provided on body', async () => {
    const output = await request(app)
      .post('/any-route')
      .set('content-type', 'multipart/form-data')
      .field('name', 'any-name')
      .field('email', 'any-email')
      .field('images[]', '[]')
      .expect(200)

    expect(output.body.body).toEqual({
      name: 'any-name',
      email: 'any-email',
      images: [],
    })
  })

  test('Should return a empry array if string array if provided on body', async () => {
    const output = await request(app)
      .post('/any-route')
      .set('content-type', 'multipart/form-data')
      .field('name', 'any-name')
      .field('email', 'any-email')
      .field('images[]', 'any-image.png')
      .field('images[]', 'other-image.png')
      .expect(200)

    expect(output.body.body).toEqual({
      name: 'any-name',
      email: 'any-email',
      images: [
        'any-image.png',
        'other-image.png',
      ],
    })
  })

  test('Should return correctly if a get method', async () => {
    const output = await request(app)
      .get('/any-route')
      .expect(200)

    expect(output.status).toEqual(200)
    expect(output.body.files).toBeFalsy()
  })
})
