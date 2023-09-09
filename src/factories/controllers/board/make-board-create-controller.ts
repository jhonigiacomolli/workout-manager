import { Controller } from '@/protocols/models/controller'
import { PgBoardReposytory } from '@/repositories/board/postgres-board-repository'
import { BoardCreateController } from '@/controllers/board/board-create/board-create-controller'

export const makeBoardCreateController = (): Controller => {
  return new BoardCreateController({
    board: new PgBoardReposytory(),
  })
}
