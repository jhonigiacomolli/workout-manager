import { BoardModel } from '@/protocols/models/board'
import { Board } from '@/protocols/use-cases/board'
import { makeFakeBoard } from './board-fakes'

export class BoardStub implements Board {
  async create(): Promise<BoardModel | undefined> {
    return Promise.resolve(makeFakeBoard())
  }

  async delete(): Promise<boolean> {
    return Promise.resolve(true)
  }

  async getAll(): Promise<BoardModel[]> {
    return Promise.resolve([makeFakeBoard()])
  }

  async getById(): Promise<BoardModel | undefined> {
    return Promise.resolve(makeFakeBoard())
  }

  async setById(): Promise<BoardModel | undefined> {
    return Promise.resolve(makeFakeBoard())
  }
}
