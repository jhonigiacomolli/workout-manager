import { BadRequestError, NotFoundError } from '@/helpers/errors'
import { httpResponse } from '@/helpers/http'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { Team } from '@/protocols/use-cases/team'

type Dependencies = {
  team: Team
}
export class LoadTeamController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const teamId = request.params.id
    if (!teamId) {
      throw new BadRequestError('Required param teamId is not provided')
    }

    const team = await this.dependencies.team.getTeamByID(teamId)

    if (!team) {
      throw new NotFoundError('Team not found')
    }

    return httpResponse(200, team)
  }
}
