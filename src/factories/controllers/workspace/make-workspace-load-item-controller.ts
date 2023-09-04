import { Controller } from '@/protocols/models/controller'
import { PgWorkspaceReposytory } from '@/repositories/workspace/postgres-workspace-repository'
import { WorkspaceLoadItemController } from '@/controllers/workspace/workspace-load-item/workspace-load-item-controller'

export const makeWorkspaceLoadItemController = (): Controller => {
  return new WorkspaceLoadItemController({
    workspace: new PgWorkspaceReposytory(),
  })
}
