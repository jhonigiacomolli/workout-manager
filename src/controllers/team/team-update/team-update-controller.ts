import { httpResponse } from '@/helpers/http'
import { Team } from '@/protocols/use-cases/team'
import { TeamModel } from '@/protocols/models/team'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { BadRequestError, EmptyParamError } from '@/helpers/errors'

type Dependencies = {
  team: Team
}

export class TeamUpdateController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id

    if (!id) throw new EmptyParamError('id')

    if (!request.body.name) throw new EmptyParamError('name')

    const teamData: Omit<TeamModel, 'id' | 'createdAt'> = {
      name: request.body.name,
      members: request.body.members,
    }

    const success = await this.dependencies.team.setTeamByID(id, teamData)

    if (!success) throw new BadRequestError('Team update fails!')

    return httpResponse(204, 'Update successfully!')
  }
}
