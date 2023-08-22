import { httpResponse } from '@/helpers/http'
import { Team } from '@/protocols/use-cases/team'
import { BadRequestError } from '@/helpers/errors'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'

type ConstructorProps = {
  team: Team
}
export class CreateTeamController implements Controller {
  constructor(private readonly dependencies: ConstructorProps) { }
  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const { name = '', members = [] } = request.body

    if (!name) {
      throw new BadRequestError('Empty param: name is required')
    }

    const data = await this.dependencies.team.create({
      name,
      members,
      createdAt: new Date().toISOString(),
    })

    return httpResponse(200, {
      message: 'Successfully registered team',
      data,
    })
  }
}
