import { httpResponse } from '@/helpers/http'
import { Group } from '@/protocols/use-cases/group'
import { Controller } from '@/protocols/models/controller'
import { UpdateGroupModel } from '@/protocols/models/group'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { paramValidation } from '@/helpers/validation/param-validation'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

type Dependencies = {
  group: Group
}

export class GroupUpdateController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }
  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id
    const updateParams: Partial<UpdateGroupModel> = {}
    const updateParamsTypes = {
      title: 'string',
      elements: 'array',
    }

    if (!id) throw new EmptyParamError('id')

    const isValidId = await this.dependencies.group.getById(id)

    if (!isValidId) throw new InvalidParamError('id')

    for (const bodyParam of Object.keys(request.body)) {
      const paramType = updateParamsTypes[bodyParam]
      const paramValue = request.body[bodyParam]
      if (paramType) {
        const isValidParam = paramValidation(paramValue, paramType)

        if (!isValidParam) throw new InvalidParamError(`${bodyParam}, must have to be a ${paramType}`)

        updateParams[bodyParam] = paramValue
      }
    }

    const updatedGroup = await this.dependencies.group.setById(id, updateParams)

    if (!updatedGroup) throw new BadRequestError('Group update fails!')

    return httpResponse(200, {
      message: 'Group updated!',
      data: updatedGroup,
    })
  }
}
