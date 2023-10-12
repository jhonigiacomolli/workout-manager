import { httpResponse } from '@/helpers/http'
import { Element } from '@/protocols/use-cases/element'
import { Controller } from '@/protocols/models/controller'
import { CreateElementModel } from '@/protocols/models/element'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { paramValidation } from '@/helpers/validation/param-validation'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

type Dependencies = {
  element: Element
}

export class ElementCreateController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const requiredFields = ['title', 'group']
    const newElement: CreateElementModel = {
      title: '',
      group: '',
      status: 'waiting',
      members: [],
      updates: [],
      expectedDate: '',
      startDate: '',
      endDate: '',
    }
    const elementTypes = {
      title: 'string',
      group: 'string',
      members: 'array',
      updates: 'array',
      expectedDate: 'string',
      startDate: 'string',
      endDate: 'string',
    }

    for (const field of requiredFields) {
      if (!request.body[field]) throw new EmptyParamError(field)
    }

    for (const fieldKey of Object.keys(elementTypes)) {
      const fieldValue = request.body[fieldKey]
      const fieldType = elementTypes[fieldKey]
      if (fieldValue) {
        const isValidType = paramValidation(fieldValue, fieldType)

        if (!isValidType) throw new InvalidParamError(`${fieldKey}, must have to be a ${fieldType}`)

        newElement[fieldKey] = fieldValue
      }
    }

    const createdElement = await this.dependencies.element.create(newElement)

    if (!createdElement) throw new BadRequestError('Element create fails!')

    return httpResponse(200, {
      message: 'Element created!',
      data: createdElement,
    })
  }
}
