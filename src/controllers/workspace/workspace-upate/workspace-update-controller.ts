import { httpResponse } from '@/helpers/http'
import { FileManager } from '@/protocols/use-cases/file'
import { Controller } from '@/protocols/models/controller'
import { Workspace } from '@/protocols/use-cases/workspace'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { UpdateWorkspaceModel } from '@/protocols/models/workspace'
import { paramValidation } from '@/helpers/validation/param-validation'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

type ParamValidation = {
  [key in keyof UpdateWorkspaceModel]: 'string' | 'array'
}

type Dependencies = {
  workspace: Workspace
  fileManager: FileManager
}

export class WorkspaceUpdateController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const paramsValidation: ParamValidation = {
      title: 'string',
      description: 'string',
      boards: 'array',
      members: 'array',
      profileImage: 'string',
      coverImage: 'string',
    }
    const params = {}

    const { id } = request.params

    if (!id) throw new EmptyParamError('id')

    const savedWorkspace = await this.dependencies.workspace.getById(id)

    if (!savedWorkspace) throw new InvalidParamError('id')

    for (const param of Object.keys(request.body)) {
      const paramType = paramsValidation[param]
      const isValidParamType = paramValidation(request.body[param], paramType)

      if (!isValidParamType) throw new InvalidParamError(`${param} must have to be a ${paramType}`)

      params[param] = request.body[param]
    }

    for (const param of Object.keys(request.files)) {
      if (savedWorkspace[param]) {
        await this.dependencies.fileManager.removeImage(savedWorkspace[param])
      }
      const uploadedImagePath = await this.dependencies.fileManager.uploadImage(request.files[param])
      params[param] = uploadedImagePath
    }

    const updatedWorkspace = await this.dependencies.workspace.setById(id, params)

    if (!updatedWorkspace) throw new BadRequestError('Workspace update fails!')

    return httpResponse(200, {
      message: 'Workspace update successfully',
      data: updatedWorkspace,
    })
  }
}
