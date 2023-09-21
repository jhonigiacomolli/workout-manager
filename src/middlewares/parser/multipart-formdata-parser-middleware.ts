import type { File } from '@/protocols/models/file'
import { RepositoryRequest } from '@/protocols/models/http'
import { NextFunction, Request, Response } from 'express'

type MultiPartValues = {
  [key: string]: string | File
}

export const multiPartFormDataParser = async (req: RepositoryRequest<Request>, res: Response, next: NextFunction) => {
  let data = ''

  if (!req.headers['content-type']?.includes('multipart/form-data')) {
    next()
    return
  }

  req.on('data', (chunk) => {
    data += chunk.toString()
  })

  const objectFormatMapper = (content: string, multipartHeader: string): MultiPartValues[] => {
    return content
      .replace('name=', '')
      .replace(/"/g, '')
      .split(multipartHeader)
      .map(splitedContent => splitedContent.split('\r\n\r\n'))
      .map(([key, value = '']) => {
        if (key.includes('Content-Type: image/')) {
          const [fileKeyName, fileValues] = key.split(';')
          const [filename, contentType] = fileValues.split('\r\n')

          return {
            [fileKeyName]: {
              filename: filename.trimStart().replace('filename=', ''),
              mime: contentType.replace('Content-Type: ', ''),
              extension: filename.split('.')[1],
              data: value,
            },
          }
        }

        return {
          [key]: value.split('\r\n')[0],
        }
      })
  }

  req.on('end', () => {
    const multipartContent = data.split('Content-Disposition: form-data; ')
    const multipartHeader = multipartContent[0]

    const parsedFields = multipartContent
      .map(content => content.replace(multipartHeader, '').trim())
      .filter(content => !!content)
      .map(content => objectFormatMapper(content, multipartHeader))
      .reduce((acc, content) => [...acc, ...content], [])
      .reduce((acc, content) => {
        const isString = typeof Object.values(content)[0] === 'string'
        const outputField = isString ? 'body' : 'files'

        return {
          ...acc,
          [outputField]: {
            ...acc[outputField],
            ...content,
          },
        }
      }, { files: {}, body: {} })

    req.body = {
      ...req.body,
      ...parsedFields.body,
    }
    req.files = {
      ...req.files,
      ...parsedFields.files,
    }

    next()
  })
}
