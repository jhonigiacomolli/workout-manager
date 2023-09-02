import { Controller } from '@/protocols/models/controller'
import { PgWorkspaceReposytory } from '@/repositories/workspace/postgres-workspace-repository'
import { WorkspaceLoadAllITemsController } from '@/controllers/workspace/workspace-load-all-items/workspace-load-all-items-controller'

export const makeWorkspaceLoadAllItemsController = (): Controller => {
  return new WorkspaceLoadAllITemsController({
    workspace: new PgWorkspaceReposytory(),
  })
}
