import { Controller } from '@/protocols/models/controller'
import { PgBoardReposytory } from '@/repositories/board/postgres-board-repository'
import { BoardRemoveController } from '@/controllers/board/board-remove/board-remove-controller'

export const makeBoardRemoveController = (): Controller => {
  return new BoardRemoveController({
    board: new PgBoardReposytory(),
  })
}
