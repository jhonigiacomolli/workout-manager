export interface WorkspaceModel {
  id: string
  createdAt: string
  title: string
  description: string
  boards: string[]
  members: string[]
  profileImage: string
  coverImage: string
}

export type CreateWorkspaceModel = Omit<WorkspaceModel, 'id'>

export type UpdateWorkspaceModel = Omit<WorkspaceModel, 'id' | 'createdAt'>
