import { WorkspaceModel } from '@/protocols/models/workspace'

type PostgresWorkspaceModel = Omit<WorkspaceModel, 'createdAt'> & {
  created_at: string
}

export const makeFakeWorkspace = (): WorkspaceModel => ({
  id: 'any_id',
  title: 'workspace_title',
  createdAt: '2023-06-30T03:00:00.000Z',
  members: [],
  boards: [],
  description: 'Any description',
  coverImage: '/profileimage',
  profileImage: '/profileimage',
})

export const makeFakePostgressWorkspace = (): PostgresWorkspaceModel => ({
  id: 'any_id',
  title: 'workspace_title',
  created_at: '2023-06-30T03:00:00.000Z',
  members: [],
  boards: [],
  description: 'Any description',
  coverImage: '/profileimage',
  profileImage: '/profileimage',
})
