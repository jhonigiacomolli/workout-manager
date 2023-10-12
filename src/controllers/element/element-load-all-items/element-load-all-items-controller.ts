import { httpResponse } from '@/helpers/http'
import { InvalidParamError } from '@/helpers/errors'
import { Element } from '@/protocols/use-cases/element'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'

type Dependencies = {
  element: Element
}

export class ElementLoadAllItemsController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const { offset, limit, page, order, orderBy } = request.query.pagination
    const orderByFields = ['id', 'createdAt', 'group', 'title', 'status', 'startData', 'expectedDate', 'endDate']

    if (!orderByFields.includes(orderBy)) {
      throw new InvalidParamError(`orderBy, accepted values(${orderByFields.join(', ')})`)
    }

    const elements = await this.dependencies.element.getAll({
      offset,
      limit,
      page,
      order,
      orderBy,
    })

    return httpResponse(200, elements)
  }
}
