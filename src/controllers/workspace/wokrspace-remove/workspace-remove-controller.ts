import { httpResponse } from '@/helpers/http'
import { Controller } from '@/protocols/models/controller'
import { Workspace } from '@/protocols/use-cases/workspace'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

type Dependencies = {
  workspace: Workspace
}

export class WorkspaceRemoveController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }
  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const { id } = request.params

    if (!id) throw new EmptyParamError('id')

    const isValidId = await this.dependencies.workspace.getById(id)

    if (!isValidId) throw new InvalidParamError('id')

    const success = await this.dependencies.workspace.delete(id)

    if (!success) throw new BadRequestError('Workspace remove failed!')

    return Promise.resolve(httpResponse(200, 'Workspace removed!'))
  }
}
