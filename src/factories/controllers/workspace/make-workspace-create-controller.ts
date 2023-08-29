import { WorkspaceCreateController } from '@/controllers/workspace/workspace-create-controller'
import { Controller } from '@/protocols/models/controller'
import { PgWorkspaceReposytory } from '@/repositories/workspace/postgres-workspace-repository'

export const makeWorkspaceCreateController = (): Controller => {
  return new WorkspaceCreateController({
    workspace: new PgWorkspaceReposytory(),
  })
}
