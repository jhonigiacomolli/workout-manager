import { InvalidParamError } from '@/helpers/errors'
import { httpResponse } from '@/helpers/http'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { Workspace } from '@/protocols/use-cases/workspace'

type Dependencies = {
  workspace: Workspace
}
export class WorkspaceLoadAllITemsController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const { limit, page, offset, orderBy, order } = request.query.pagination

    const fields = ['id', 'title', 'createdAt']

    if (!fields.includes(orderBy)) {
      throw new InvalidParamError(`orderBy, accepted params(${fields.join(',')})`)
    }

    const workspaces = await this.dependencies.workspace.getAll({
      limit,
      page,
      offset,
      orderBy,
      order,
    })

    return httpResponse(200, workspaces)
  }
}
