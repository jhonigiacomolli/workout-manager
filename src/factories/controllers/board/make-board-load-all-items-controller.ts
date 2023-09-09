import { Controller } from '@/protocols/models/controller'
import { PgBoardReposytory } from '@/repositories/board/postgres-board-repository'
import { BoardLoadAllItemsController } from '@/controllers/board/board-load-all-items/board-load-all-items-controller'

export const makeBoardLoadAllItemsController = (): Controller => {
  return new BoardLoadAllItemsController({
    board: new PgBoardReposytory(),
  })
}
