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
    try {
      const teamId = request.body.teamId
      if (!teamId) {
        return Promise.resolve(httpResponse(400, 'Required param teamId is not provided'))
      }

      const team = await this.dependencies.team.getTeamByID(teamId)

      if (!team) {
        return Promise.resolve(httpResponse(404, 'Invalid param: teamId'))
      }

      return Promise.resolve(httpResponse(200, { data: team }))
    } catch {
      return Promise.resolve(httpResponse(500, 'Internal Server Error'))
    }
  }
}
