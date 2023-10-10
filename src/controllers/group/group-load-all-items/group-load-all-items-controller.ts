import { httpResponse } from '@/helpers/http'
import { Group } from '@/protocols/use-cases/group'
import { InvalidParamError } from '@/helpers/errors'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'

type Dependencies = {
  group: Group
}

export class GroupLoadAllItemsController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }
  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const { limit, page, offset, order, orderBy } = request.query.pagination

    const orderbyFields = ['id', 'createdAt', 'title', 'elements']

    if (!orderbyFields.includes(orderBy)) {
      throw new InvalidParamError(`orderBy, accepted values(${orderbyFields.join(', ')})`)
    }

    const groups = await this.dependencies.group.getAll({
      limit,
      page,
      offset,
      order,
      orderBy,
    })

    return httpResponse(200, groups)
  }
}
