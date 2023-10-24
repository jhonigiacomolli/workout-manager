import { httpResponse } from '@/helpers/http'
import { InvalidParamError } from '@/helpers/errors'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { ElementUpdate } from '@/protocols/use-cases/element-update'

type Dependencies = {
  repository: ElementUpdate
}

export class ElementUpdateLoadAllItemsController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const { limit, page, offset, order, orderBy } = request.query.pagination
    const acceptedOrderByFields = ['id', 'createdAt', 'user', 'updatedAt', 'content']

    if (!acceptedOrderByFields.includes(orderBy)) {
      throw new InvalidParamError(`orderBy, accepted values(${acceptedOrderByFields.join(', ')})`)
    }

    const elementUpdates = await this.dependencies.repository.getAll({
      limit,
      page,
      offset,
      order,
      orderBy,
    })

    return httpResponse(200, elementUpdates)
  }
}
