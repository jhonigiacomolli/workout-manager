import { httpResponse } from '@/helpers/http'
import { FileManager } from '@/protocols/use-cases/file'
import { Controller } from '@/protocols/models/controller'
import { Workspace } from '@/protocols/use-cases/workspace'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

type Dependencies = {
  workspace: Workspace
  fileManager: FileManager
}

export class WorkspaceRemoveController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }
  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const { id } = request.params

    if (!id) throw new EmptyParamError('id')

    const savedWorkspace = await this.dependencies.workspace.getById(id)

    if (!savedWorkspace) throw new InvalidParamError('id')

    const images = ['coverImage', 'profileImage']

    for (const image of images) {
      if (savedWorkspace[image]) {
        await this.dependencies.fileManager.removeImage(savedWorkspace[image])
      }
    }

    const success = await this.dependencies.workspace.delete(id)

    if (!success) throw new BadRequestError('Workspace remove failed!')

    return Promise.resolve(httpResponse(204, 'Workspace removed!'))
  }
}
