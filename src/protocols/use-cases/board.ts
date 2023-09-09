import { type BoardModel } from '../models/board'
import { HTTPRequestParams } from '../models/http'

export type CreateBoardParams = Omit<BoardModel, 'id' | 'createdAt'>

export type UpdateBoardParams = Omit<BoardModel, 'id' | 'createdAt'>

export interface Board {
  create: (board: CreateBoardParams) => Promise<BoardModel | undefined>
  delete: (id: string) => Promise<boolean>
  getAll: (params: HTTPRequestParams) => Promise<BoardModel[]>
  getById: (id: string) => Promise<BoardModel | undefined>
  setById: (id: string, params: Partial<BoardModel>) => Promise<BoardModel | undefined>
}
