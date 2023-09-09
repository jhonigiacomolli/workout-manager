import { InvalidParamError } from '@/helpers/errors'
import { httpResponse } from '@/helpers/http'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { Board } from '@/protocols/use-cases/board'

type Dependencies = {
  board: Board
}
export class BoardLoadAllItemsController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const { limit, page, offset, order, orderBy } = request.params.pagination

    const fields = ['createdAt', 'format', 'id', 'title']

    if (!fields.includes(orderBy)) {
      throw new InvalidParamError(`orderBy, accepted values(${fields.join(',')})`)
    }

    const boardList = await this.dependencies.board.getAll({
      limit,
      page,
      offset,
      order,
      orderBy,
    })

    return httpResponse(200, boardList)
  }
}
