import { httpResponse } from '@/helpers/http'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { ElementUpdate } from '@/protocols/use-cases/element-update'
import { paramValidation } from '@/helpers/validation/param-validation'
import { CreateElementUpdateModel } from '@/protocols/models/element-update'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

type Dependencies = {
  respository: ElementUpdate
}

export class ElementUpdateCreateController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const requiredParams = ['content', 'user']
    const elementUpdateTypes = {
      content: 'string',
      user: 'string',
      attachments: 'array',
    }
    const newElementUpdateParams: CreateElementUpdateModel = {
      content: '',
      user: '',
      attachments: [],
    }

    for (const requiredParam of requiredParams) {
      if (!request.body[requiredParam]) throw new EmptyParamError(requiredParam)
    }

    for (const paramKey of Object.keys(newElementUpdateParams)) {
      const paramValue = request.body[paramKey]
      const paramType = elementUpdateTypes[paramKey]
      const isValidType = paramValidation(paramValue, paramType)

      if (!isValidType) throw new InvalidParamError(`${paramKey}, must have to be a ${paramType}`)

      newElementUpdateParams[paramKey] = paramValue
    }

    const newElementUpdate = await this.dependencies.respository.create(newElementUpdateParams)

    if (!newElementUpdate) throw new BadRequestError('Element update create fails!')

    return httpResponse(200, {
      message: 'Element update created!',
      data: newElementUpdate,
    })
  }
}
