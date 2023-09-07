export type WorkspaceModel = {
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

export type UpdateWorkspaceModel = Partial<Omit<WorkspaceModel, 'id' | 'createdAt'>>
