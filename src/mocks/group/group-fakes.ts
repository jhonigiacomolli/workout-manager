import { GroupModel } from '@/protocols/models/group'

export const makeFakeGroup = (): GroupModel => ({
  id: 'any-id',
  title: 'any-group-title',
  createdAt: '06/10/2023',
  elements: [],
})

export const makeFakePostgresGroup = (): Omit<GroupModel, 'createdAt'> & { created_at: string } => ({
  id: 'any-id',
  title: 'any-group-title',
  created_at: '06/10/2023',
  elements: [],
})
