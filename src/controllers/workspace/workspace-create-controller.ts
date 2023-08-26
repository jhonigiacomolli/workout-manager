import { httpResponse } from '@/helpers/http'
import { Controller } from '@/protocols/models/controller'
import { Workspace } from '@/protocols/use-cases/workspace'
import { CreateWorkspaceModel } from '@/protocols/models/workspace'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { paramValidation } from '@/helpers/validation/param-validation'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

type ParamValidation = {
  [key in keyof CreateWorkspaceModel]: 'string' | 'array'
}

type Dependencies = {
  workspace: Workspace
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
      profileImage: 'string',
      coverImage: 'string',
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

    if (!request.body.title) throw new EmptyParamError('title')

    const newWorkspace = await this.dependencies.workspace.create(workspaceParams)

    if (!newWorkspace?.id) throw new BadRequestError('Workspace create fails!')

    return httpResponse(200, {
      message: 'Workspace created successfully!',
      data: newWorkspace,
    })
  }
}
