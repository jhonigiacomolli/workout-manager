import { Controller } from '@/protocols/models/controller'
import { PgWorkspaceReposytory } from '@/repositories/workspace/postgres-workspace-repository'
import { WorkspaceCreateController } from '@/controllers/workspace/workspace-create/workspace-create-controller'

export const makeWorkspaceCreateController = (): Controller => {
  return new WorkspaceCreateController({
    workspace: new PgWorkspaceReposytory(),
  })
}
