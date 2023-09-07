import { httpResponse } from '@/helpers/http'
import { BoardFormats } from '@/protocols/models/board'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { Board, CreateBoardParams } from '@/protocols/use-cases/board'
import { paramValidation } from '@/helpers/validation/param-validation'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

type Dependencies = {
  board: Board
}

export class BoardCreateController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const validBoardFormats: BoardFormats[] = ['kanban', 'gant', 'table']
    const requiredFields = ['title', 'format']
    const newBoard: CreateBoardParams = {
      title: '',
      format: 'table',
      groups: [],
    }
    const boardTypes = {
      title: 'string',
      format: 'string',
      groups: 'array',
      createdAt: 'string',
    }

    for (const paramKey of Object.keys(request.body)) {
      const paramType = boardTypes[paramKey]
      const param = request.body[paramKey]

      if (paramKey === 'format' && !validBoardFormats.includes(param)) {
        throw new InvalidParamError('format, accepted values(kanban,gant,table)')
      }

      const isValidParamType = paramValidation(param, paramType)

      if (!isValidParamType) throw new InvalidParamError(`${paramKey} must to be a ${paramType}`)

      newBoard[paramKey] = param
    }

    for (const field of requiredFields) {
      if (!request.body[field]) throw new EmptyParamError(field)
    }

    const board = await this.dependencies.board.create(newBoard)

    if (!board) throw new BadRequestError('Board creation fails!')

    return Promise.resolve(httpResponse(200, {
      message: 'Successfully registered board',
      data: board,
    }))
  }
}
