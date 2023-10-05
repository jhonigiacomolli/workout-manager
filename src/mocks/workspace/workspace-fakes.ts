import { WorkspaceModel } from '@/protocols/models/workspace'

type PostgresWorkspaceModel = Omit<WorkspaceModel, 'createdAt' | 'profileImage' | 'coverImage'> & {
  created_at: string
  coverimage: string
  profileimage: string
}

export const makeFakeWorkspace = (): WorkspaceModel => ({
  id: 'any_id',
  title: 'workspace_title',
  createdAt: '2023-06-30T03:00:00.000Z',
  members: [],
  boards: [],
  description: 'Any description',
  coverImage: '/coverimage',
  profileImage: '/profileimage',
})

export const makeFakePostgressWorkspace = (): PostgresWorkspaceModel => ({
  id: 'any_id',
  title: 'workspace_title',
  created_at: '2023-06-30T03:00:00.000Z',
  members: [],
  boards: [],
  description: 'Any description',
  coverimage: '/coverimage',
  profileimage: '/profileimage',
})
