import { Controller } from '@/protocols/models/controller'
import { PgWorkspaceReposytory } from '@/repositories/workspace/postgres-workspace-repository'
import { WorkspaceUpdateController } from '@/controllers/workspace/workspace-upate/workspace-update-controller'

export const makeWorkspaceUpdateController = (): Controller => {
  return new WorkspaceUpdateController({
    workspace: new PgWorkspaceReposytory(),
  })
}
