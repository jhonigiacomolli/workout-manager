import { httpResponse } from '@/helpers/http'
import { Element } from '@/protocols/use-cases/element'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { BadRequestError, EmptyParamError, NotFoundError } from '@/helpers/errors'

type Dependencies = {
  element: Element
}

export class ElementRemoveController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }
  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id

    if (!id) throw new EmptyParamError('id')

    const isValidElement = await this.dependencies.element.getById(id)

    if (!isValidElement) throw new NotFoundError('Element not found!')

    const isRemoved = await this.dependencies.element.delete(id)

    if (!isRemoved) throw new BadRequestError('Element remove fails!')

    return httpResponse(204, 'Element removed!')
  }
}
