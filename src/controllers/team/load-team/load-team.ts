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
      return Promise.resolve(httpResponse(400, 'Required param teamId is not provided'))
    }

    const team = await this.dependencies.team.getTeamByID(teamId)

    if (!team) {
      return Promise.resolve(httpResponse(404, 'Team not found'))
    }

    return Promise.resolve(httpResponse(200, { data: team }))
  }
}
