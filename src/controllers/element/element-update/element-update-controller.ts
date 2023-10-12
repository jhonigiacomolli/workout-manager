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

export class ElementUdpateController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id
    const elementTypes = {
      title: 'string',
      group: 'string',
      status: 'string',
      members: 'array',
      updates: 'array',
      expectedDate: 'string',
      startDate: 'string',
      endDate: 'string',
    }
    const updateParams: Partial<CreateElementModel> = {}

    if (!id) throw new EmptyParamError('id')

    for (const fieldKey of Object.keys(elementTypes)) {
      const fieldValue = request.body[fieldKey]
      if (typeof fieldValue !== 'undefined') {
        const fieldType = elementTypes[fieldKey]
        const isValidType = paramValidation(fieldValue, fieldType)

        if (!isValidType) throw new InvalidParamError(`${fieldKey}, must have to be a ${fieldType}`)

        updateParams[fieldKey] = fieldValue
      }
    }

    const updatedElement = await this.dependencies.element.setById(id, updateParams)

    if (!updatedElement) throw new BadRequestError('Element update fails!')

    return httpResponse(200, {
      message: 'Element updated!',
      data: updatedElement,
    })
  }
}
