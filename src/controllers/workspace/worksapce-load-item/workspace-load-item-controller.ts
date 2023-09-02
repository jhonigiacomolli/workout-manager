import { BadRequestError, NotFoundError } from '@/helpers/errors'
import { httpResponse } from '@/helpers/http'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { Workspace } from '@/protocols/use-cases/workspace'

type Dependencies = {
  workspace: Workspace
}

export class WorkspaceLoadItemController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(httpRequest: HTTPRequest): Promise<HTTPResponse> {
    const { id } = httpRequest.params

    if (!id) throw new BadRequestError('Required param id is not provided')

    const workspace = await this.dependencies.workspace.getById(id)

    if (!workspace?.id) throw new NotFoundError('Workspace not found!')

    return httpResponse(200, workspace)
  }
}
