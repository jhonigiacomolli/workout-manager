import { BoardModel } from '@/protocols/models/board'

export const makeFakeBoard = (): BoardModel => ({
  id: 'valid_id',
  createdAt: '2023-06-30T03:00:00.000Z',
  title: 'valid_title',
  groups: [],
  format: 'gant',
})

export const makePostgresFakeBoard = (): { created_at: string } & Omit<BoardModel, 'createdAt'> => ({
  id: 'valid_id',
  created_at: '2023-06-30T03:00:00.000Z',
  title: 'valid_title',
  groups: [],
  format: 'gant',
})
