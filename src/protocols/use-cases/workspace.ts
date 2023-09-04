import { HTTPRequestParams } from '../models/http'
import { CreateWorkspaceModel, UpdateWorkspaceModel, WorkspaceModel } from '@/protocols/models/workspace'

export interface Workspace {
  create: (workspace: CreateWorkspaceModel) => Promise<WorkspaceModel | undefined>
  getAll: (params?: HTTPRequestParams) => Promise<WorkspaceModel[]>
  getById: (id: string) => Promise<WorkspaceModel | undefined>
  setById: (id: string, params: UpdateWorkspaceModel) => Promise<WorkspaceModel | undefined>
}
