import { RepositoryRequest } from '@/protocols/models/http'
import { NextFunction, Request, Response } from 'express'
import path from 'path'

export const multiPartFormDataParser = async (req: RepositoryRequest<Request>, res: Response, next: NextFunction) => {
  if (!req.headers['content-type']?.includes('multipart/form-data')) {
    next()
    return
  }

  req.setEncoding('latin1')

  let rawData = ''
  req.on('data', chunk => {
    rawData += chunk
  })

  req.on('end', () => {
    req.files = {}

    const boundary = getBoundary(req.headers['content-type'] as string)

    const rawDataArray = rawData.split(boundary)
    for (const item of rawDataArray) {
      const name = getMatching(item, /(?:name=")(.+?)(?:")/)?.trim() as string

      const value = getMatching(item, /(?:\r\n\r\n)([\S\s]*)(?:\r\n--$)/)?.trim()
      if (!value) continue

      const filename = getMatching(item, /(?:filename=")(.*?)(?:")/)

      if (filename) {
        const contentType = getMatching(item, /(?:Content-Type:)(.*?)(?:\r\n)/) as string
        req.files[name] = {
          filename,
          mime: contentType.trim(),
          extension: path.extname(filename).replace('.', ''),
          data: value,
        }
      } else {
        req.body[name] = value
      }
    }

    next()
  })
}

function getBoundary(contentType: string) {
  const contentTypeArray = contentType.split(';').map(item => item.trim())
  const boundaryPrefix = 'boundary='
  let boundary = contentTypeArray.find(item => item.startsWith(boundaryPrefix)) as string

  boundary = boundary.slice(boundaryPrefix.length)
  if (boundary) boundary = boundary.trim()
  return boundary
}

function getMatching(value: string, regex: RegExp) {
  const matches = value.match(regex)
  if (!matches || matches.length < 2) {
    return null
  }
  return matches[1]
}
