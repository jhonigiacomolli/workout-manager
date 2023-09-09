import { Controller } from '@/protocols/models/controller'
import { PgBoardReposytory } from '@/repositories/board/postgres-board-repository'
import { BoardLoadItemController } from '@/controllers/board/board-load-item/board-load-item-controller'

export const makeBoardLoadItemController = (): Controller => {
  return new BoardLoadItemController({
    board: new PgBoardReposytory(),
  })
}
