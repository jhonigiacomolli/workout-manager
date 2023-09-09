import { httpResponse } from '@/helpers/http'
import { Board } from '@/protocols/use-cases/board'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { BadRequestError, EmptyParamError } from '@/helpers/errors'

type Dependencies = {
  board: Board
}

export class BoardRemoveController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const { id } = request.params

    if (!id) throw new EmptyParamError('id')

    const removeSuccess = await this.dependencies.board.delete(id)

    if (!removeSuccess) throw new BadRequestError('Board remove fails!')

    return httpResponse(204, 'Board removed!')
  }
}
