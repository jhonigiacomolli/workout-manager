import { httpResponse } from '@/helpers/http'
import { Board } from '@/protocols/use-cases/board'
import { Controller } from '@/protocols/models/controller'
import { EmptyParamError, NotFoundError } from '@/helpers/errors'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'

type Dependencies = {
  board: Board
}

export class BoardLoadItemController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const { id } = request.params

    if (!id) throw new EmptyParamError('id')

    const board = await this.dependencies.board.getById(id)

    if (!board) throw new NotFoundError('Board not found!')

    return httpResponse(200, board)
  }
}
