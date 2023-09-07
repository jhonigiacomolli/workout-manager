import { type BoardModel } from '../models/board'

export type CreateBoardParams = Omit<BoardModel, 'id' | 'createdAt'>

export type UpdateBoardParams = Omit<BoardModel, 'id' | 'createdAt'>

export interface Board {
  create: (board: CreateBoardParams) => Promise<BoardModel | undefined>
}
