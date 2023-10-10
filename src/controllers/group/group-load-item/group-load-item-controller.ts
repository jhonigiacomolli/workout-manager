import { httpResponse } from '@/helpers/http'
import { Group } from '@/protocols/use-cases/group'
import { Controller } from '@/protocols/models/controller'
import { EmptyParamError, NotFoundError } from '@/helpers/errors'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'

type Dependencies = {
  group: Group
}

export class GroupLoadItemController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }
  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id

    if (!id) throw new EmptyParamError('id')

    const group = await this.dependencies.group.getById(id)

    if (!group) throw new NotFoundError('Group not found!')

    return httpResponse(200, group)
  }
}
