import { httpResponse } from '@/helpers/http'
import { Team } from '@/protocols/use-cases/team'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { BadRequestError, EmptyParamError } from '@/helpers/errors'

type Dependencies = {
  team: Team
}

export class TeamRemoveController implements Controller {
  constructor(
    private readonly dependencies: Dependencies,
  ) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const teamId = request.params.id

    if (!teamId) {
      throw new EmptyParamError('id')
    }

    const success = await this.dependencies.team.delete(teamId)

    if (!success) {
      throw new BadRequestError('Team removal failed!')
    }

    return httpResponse(200, 'Team removed')
  }
}
