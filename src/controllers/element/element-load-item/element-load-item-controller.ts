import { httpResponse } from '@/helpers/http'
import { Element } from '@/protocols/use-cases/element'
import { Controller } from '@/protocols/models/controller'
import { EmptyParamError, NotFoundError } from '@/helpers/errors'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'

type Dependencies = {
  element: Element
}

export class ElementLoadItemController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id

    if (!id) throw new EmptyParamError('id')

    const element = await this.dependencies.element.getById(id)

    if (!element) throw new NotFoundError('Element not found!')

    return httpResponse(200, element)
  }
}
