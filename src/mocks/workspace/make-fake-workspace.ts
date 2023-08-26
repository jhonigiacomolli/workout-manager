import { WorkspaceModel } from '@/protocols/models/workspace'

export const makeFakeWorkspace = (): WorkspaceModel => ({
  id: 'any_id',
  title: 'workspace_title',
  createdAt: '2023/08/26',
  members: [],
  boards: [],
  description: 'Any description',
  coverImage: 'https://workoutmanager.com.br/profileimage',
  profileImage: 'https://workoutmanager.com.br/profileimage',
})
