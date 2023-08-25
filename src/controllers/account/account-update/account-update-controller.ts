import { type Account } from '@/protocols/use-cases/account'
import { type Controller } from '@/protocols/models/controller'
import { type HTTPRequest, type HTTPResponse } from '@/protocols/models/http'

import { httpResponse } from '@/helpers/http'
import { Team } from '@/protocols/use-cases/team'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

interface ConstructorProps {
  account: Account
  team: Team
}

export class AccountUdateController implements Controller {
  constructor(private readonly dependencies: ConstructorProps) {
  }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id

    if (!id) throw new EmptyParamError('id')

    const requiredParams = ['name', 'email']

    for (const param of requiredParams) {
      if (!request.body[param]) throw new EmptyParamError(`${param}`)
    }

    if (request.body.teamId) {
      const team = await this.dependencies.team.getTeamByID(request.body.teamId)

      if (!team) throw new InvalidParamError('teamId')
    } else {
      request.body.teamId = undefined
    }

    const success = await this.dependencies.account.setUserById(id, request.body)

    if (!success) throw new BadRequestError('Account update fails')

    return httpResponse(201, 'User updated successfully')
  }
}
