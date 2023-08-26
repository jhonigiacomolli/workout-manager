import { CreateWorkspaceModel, WorkspaceModel } from '@/protocols/models/workspace'

export interface Workspace {
  create: (workspace: CreateWorkspaceModel) => Promise<WorkspaceModel | undefined>
}
