import { httpResponse } from '@/helpers/http'
import { Team } from '@/protocols/use-cases/team'
import { TeamModel } from '@/protocols/models/team'
import { InvalidParamError } from '@/helpers/errors'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'

type Dependencies = {
  team: Team
}

type TeamKeys = keyof TeamModel

export class TeamLoadAllItemsController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const { limit, page, offset, orderBy, order } = request.query.pagination

    const fields: TeamKeys[] = ['id', 'name', 'members']

    if (!fields.includes(orderBy)) {
      throw new InvalidParamError(`orderBy, accepted params(${fields.join(',')})`)
    }

    const teams = await this.dependencies.team.getAllTeams({
      limit,
      page,
      offset,
      orderBy,
      order,
    })

    return httpResponse(200, teams)
  }
}
