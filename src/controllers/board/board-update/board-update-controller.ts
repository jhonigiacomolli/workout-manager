import { EmptyParamError, InvalidParamError, NotFoundError } from '@/helpers/errors'
import { httpResponse } from '@/helpers/http'
import { paramValidation } from '@/helpers/validation/param-validation'
import { BoardModel } from '@/protocols/models/board'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { Board } from '@/protocols/use-cases/board'

type Dependencies = {
  board: Board
}

export class BoardUpdateController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const { id } = request.params
    const boardParams: Partial<BoardModel> = {}
    const boardModelTypes = {
      title: 'string',
      format: 'string',
      createdAt: 'string',
      groups: 'array',
    }

    if (!id) throw new EmptyParamError('id')

    for (const paramKey of Object.keys(request.body)) {
      const paramValue = request.body[paramKey]
      const paramType = boardModelTypes[paramKey]
      const isValidParamType = paramValidation(paramValue, paramType)

      if (paramValue && !isValidParamType) {
        throw new InvalidParamError(`${paramKey} must have to be a ${paramType}`)
      }

      boardParams[paramKey] = paramValue
    }

    const updatedBoard = await this.dependencies.board.setById(id, boardParams)

    if (!updatedBoard) throw new NotFoundError('Board not found!')

    return httpResponse(200, {
      message: 'Board update successfully!',
      data: updatedBoard,
    })
  }
}
