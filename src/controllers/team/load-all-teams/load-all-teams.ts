import { httpResponse } from '@/helpers/http'
import { Team } from '@/protocols/use-cases/team'
import { TeamModel } from '@/protocols/models/team'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'

type Dependencies = {
  team: Team
}

type TeamKeys = keyof TeamModel

export class LoadAllTeamsController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    try {
      const { limit, page, orderBy, order } = request.query.pagination

      const fields: TeamKeys[] = ['id', 'name', 'members']

      const orderByField = fields.includes(orderBy) ? orderBy : 'name'

      const teams = await this.dependencies.team.getAllTeams({
        limit,
        page,
        orderBy: orderByField,
        order,
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
