import { Controller } from '@/protocols/models/controller'
import { PgWorkspaceReposytory } from '@/repositories/workspace/postgres-workspace-repository'
import { WorkspaceRemoveController } from '@/controllers/workspace/workspace-remove/workspace-remove-controller'

export const makeWorkspaceRemoveController = (): Controller => {
  return new WorkspaceRemoveController({
    workspace: new PgWorkspaceReposytory(),
  })
}
