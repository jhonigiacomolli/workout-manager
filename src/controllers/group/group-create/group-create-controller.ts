import { httpResponse } from '@/helpers/http'
import { Group } from '@/protocols/use-cases/group'
import { Controller } from '@/protocols/models/controller'
import { CreateGroupModel } from '@/protocols/models/group'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { paramValidation } from '@/helpers/validation/param-validation'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

type Dependencies = {
  group: Group
}

export class GroupCreateController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }
  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const requiredParams = ['title']
    const groupParamTypes = {
      title: 'string',
      elements: 'array',
    }
    const newGroup: CreateGroupModel = {
      title: '',
      elements: [],
    }

    for (const bodyParam of Object.keys(newGroup)) {
      const paramType = groupParamTypes[bodyParam]
      const paramValue = request.body[bodyParam]

      if (paramValue && !paramValidation(paramValue, paramType)) {
        throw new InvalidParamError(`${bodyParam}, must have to be a ${paramType}`)
      }
      newGroup[bodyParam] = request.body[bodyParam]
    }

    for (const param of requiredParams) {
      if (!newGroup[param]) throw new EmptyParamError(param)
    }

    const createdGroup = await this.dependencies.group.create(newGroup)

    if (!createdGroup) throw new BadRequestError('Group create method fails!')

    return httpResponse(200, {
      message: 'Group created successfully!',
      data: createdGroup,
    })
  }
}
