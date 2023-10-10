import { httpResponse } from '@/helpers/http'
import { Group } from '@/protocols/use-cases/group'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { BadRequestError, EmptyParamError } from '@/helpers/errors'

type Dependencies = {
  group: Group
}

export class GroupRemoveController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }
  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id

    if (!id) throw new EmptyParamError('id')

    const removeSuccess = await this.dependencies.group.delete(id)

    if (!removeSuccess) throw new BadRequestError('Group remove fails!')

    return httpResponse(204, 'Group removed!')
  }
}
