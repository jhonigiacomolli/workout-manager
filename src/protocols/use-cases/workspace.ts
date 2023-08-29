import { CreateWorkspaceModel, WorkspaceModel } from '@/protocols/models/workspace'
import { HTTPRequestParams } from '../models/http'

export interface Workspace {
  create: (workspace: CreateWorkspaceModel) => Promise<WorkspaceModel | undefined>
  getAll: (params?: HTTPRequestParams) => Promise<WorkspaceModel[]>
}
