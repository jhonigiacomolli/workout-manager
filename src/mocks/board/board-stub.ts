import { BoardModel } from '@/protocols/models/board'
import { Board } from '@/protocols/use-cases/board'
import { makeFakeBoard } from './board-fakes'

export class BoardStub implements Board {
  async create(): Promise<BoardModel | undefined> {
    return Promise.resolve(makeFakeBoard())
  }
}
