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
      const teams = await this.dependencies.team.getAllTeams({
        limit: request.query.pagination.limit,
        page: request.query.pagination.page,
        sort: request.query.pagination.sort,
        order: request.query.pagination.order,
      })

      return {
        statusCode: 200,
        body: teams,
      }
    } catch {
      return httpResponse(500, 'Internal Server Error')
    }
  }
}
