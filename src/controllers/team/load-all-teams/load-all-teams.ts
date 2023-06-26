import { httpResponse } from '@/helpers/http'
import { Team } from '@/protocols/use-cases/team'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'

type Dependencies = {
  team: Team
}
export class LoadAllTeamsController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    try {
      const {
        limit = '10',
        page = '1',
        order = 'desc',
        sort = 'id',
      } = request.params

      const teams = await this.dependencies.team.getAllTeams({
        limit,
        page,
        order,
        sort,
      })

      return httpResponse(200, teams)
    } catch {
      return httpResponse(500, 'Internal Server Error')
    }
  }
}
