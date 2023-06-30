import { type Account } from '@/protocols/use-cases/account'
import { type Controller } from '@/protocols/models/controller'
import { type HTTPRequest, type HTTPResponse } from '@/protocols/models/http'

import { httpResponse } from '@/helpers/http'
import { Team } from '@/protocols/use-cases/team'

interface ConstructorProps {
  account: Account
  team: Team
}

export class AccountUdateController implements Controller {
  constructor(private readonly dependencies: ConstructorProps) {
  }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    try {
      const id = request.params.id

      if (!id) {
        return httpResponse(400, 'Empty param: id is required')
      }

      const requiredParams = ['name', 'email']

      for (const param of requiredParams) {
        if (!request.body[param]) {
          return httpResponse(400, `Empty param: ${param} is required`)
        }
      }

      if (request.body.teamId) {
        const team = await this.dependencies.team.getTeamByID(request.body.teamId)

        if (!team) {
          return httpResponse(400, 'Invalid param: teamId')
        }
      } else {
        request.body.teamId = undefined
      }

      const success = await this.dependencies.account.setUserById(id, request.body)

      if (!success) {
        return httpResponse(400, 'Account update fails')
      }

      return httpResponse(201, 'User updated successfully')
    } catch (err) {
      return httpResponse(500, 'Internal Server Error')
    }
  }
}
