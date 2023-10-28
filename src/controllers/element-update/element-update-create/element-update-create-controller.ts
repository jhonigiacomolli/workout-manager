import { httpResponse } from '@/helpers/http'
import { FileManager } from '@/protocols/use-cases/file'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { ElementUpdate } from '@/protocols/use-cases/element-update'
import { paramValidation } from '@/helpers/validation/param-validation'
import { CreateElementUpdateModel } from '@/protocols/models/element-update'
import { BadRequestError, EmptyParamError, InvalidParamError, NotFoundError } from '@/helpers/errors'
import { Element } from '@/protocols/use-cases/element'

type Dependencies = {
  respository: ElementUpdate
  element: Element
  fileManager: FileManager
}

export class ElementUpdateCreateController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const attachments = request.files.attachments
    const requiredParams = ['elementId', 'content', 'user']
    const elementUpdateTypes = {
      content: 'string',
      elementId: 'string',
      user: 'string',
    }
    const newElementUpdateParams: CreateElementUpdateModel = {
      content: '',
      elementId: '',
      user: '',
      attachments: [],
    }

    for (const requiredParam of requiredParams) {
      if (!request.body[requiredParam]) throw new EmptyParamError(requiredParam)
    }

    const isValidElementId = await this.dependencies.element.getById(request.body.elementId)

    if (!isValidElementId) throw new NotFoundError('Element not found!')

    for (const paramKey of Object.keys(elementUpdateTypes)) {
      const paramValue = request.body[paramKey]
      const paramType = elementUpdateTypes[paramKey]
      const isValidType = paramValidation(paramValue, paramType)

      if (!isValidType) throw new InvalidParamError(`${paramKey}, must have to be a ${paramType}`)

      newElementUpdateParams[paramKey] = paramValue
    }

    if (attachments) {
      if (!Array.isArray(attachments)) throw new InvalidParamError('attachments, must have to be a array of files!')

      for (const file of request.files.attachments) {
        const imagePath = await this.dependencies.fileManager.uploadImage(file)

        if (!imagePath) throw new BadRequestError('Upload attachment fails!')

        newElementUpdateParams.attachments.push(imagePath)
      }
    }

    const newElementUpdate = await this.dependencies.respository.create(newElementUpdateParams)

    if (!newElementUpdate) throw new BadRequestError('Element update create fails!')

    return httpResponse(200, {
      message: 'Element update created!',
      data: {
        ...newElementUpdate,
        attachments: newElementUpdate.attachments.map(attachment => request.baseUrl + attachment),
      },
    })
  }
}
