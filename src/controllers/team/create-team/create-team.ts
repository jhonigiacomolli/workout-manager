import { httpResponse } from '@/helpers/http'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { Team } from '@/protocols/use-cases/team'

type ConstructorProps = {
  team: Team
}
export class CreateTeamController implements Controller {
  constructor(private readonly dependencies: ConstructorProps) { }
  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    try {
      const { name = '', members = [] } = request.body

      if (!name) {
        return httpResponse(400, 'Empty param: name is required')
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
    } catch {
      return httpResponse(500, 'Internal Server Error')
    }
  }
}
