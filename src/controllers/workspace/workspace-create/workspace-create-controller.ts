import { httpResponse } from '@/helpers/http'
import { Controller } from '@/protocols/models/controller'
import { Workspace } from '@/protocols/use-cases/workspace'
import { CreateWorkspaceModel } from '@/protocols/models/workspace'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { paramValidation } from '@/helpers/validation/param-validation'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'
import { FileManager } from '@/protocols/use-cases/file'

type ParamValidation = {
  [key in keyof CreateWorkspaceModel]: 'string' | 'array' | 'object'
}

type Dependencies = {
  workspace: Workspace
  fileManager: FileManager
}
export class WorkspaceCreateController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const workspaceParams: CreateWorkspaceModel = {
      title: '',
      createdAt: '',
      description: '',
      boards: [],
      members: [],
      profileImage: '',
      coverImage: '',
    }
    const paramsValidation: ParamValidation = {
      title: 'string',
      description: 'string',
      boards: 'array',
      members: 'array',
      profileImage: 'object',
      coverImage: 'object',
      createdAt: 'string',
    }

    for (const param of Object.keys(request.body)) {
      const paramType = paramsValidation[param]
      const isValid = paramValidation(request.body[param], paramType)

      if (isValid) {
        workspaceParams[param] = request.body[param]
      } else {
        throw new InvalidParamError(`${param} must to be a ${paramType}`)
      }
    }

    const imageParams = ['coverImage', 'profileImage']
    for (const param of Object.keys(request.files)) {
      if (imageParams.includes(param)) {
        const imagePath = await this.dependencies.fileManager.uploadImage(request.files[param])

        workspaceParams[param] = imagePath
      }
    }

    if (!request.body.title) throw new EmptyParamError('title')

    const newWorkspace = await this.dependencies.workspace.create(workspaceParams)

    if (!newWorkspace?.id) throw new BadRequestError('Workspace create fails!')

    for (const image of imageParams) {
      if (newWorkspace[image]) {
        newWorkspace[image] = request.baseUrl + newWorkspace[image]
      }
    }
    return httpResponse(200, {
      message: 'Workspace created successfully!',
      data: newWorkspace,
    })
  }
}
