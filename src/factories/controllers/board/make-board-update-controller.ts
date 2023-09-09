import { Controller } from '@/protocols/models/controller'
import { PgBoardReposytory } from '@/repositories/board/postgres-board-repository'
import { BoardUpdateController } from '@/controllers/board/board-update/board-update-controller'

export const makeBoardUpdateController = (): Controller => {
  return new BoardUpdateController({
    board: new PgBoardReposytory(),
  })
}
