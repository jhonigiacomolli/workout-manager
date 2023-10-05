import { Controller } from '@/protocols/models/controller'
import { LocalFileManagerRepository } from '@/repositories/file-manager/local-file-manager'
import { PgWorkspaceReposytory } from '@/repositories/workspace/postgres-workspace-repository'
import { WorkspaceCreateController } from '@/controllers/workspace/workspace-create/workspace-create-controller'

export const makeWorkspaceCreateController = (): Controller => {
  return new WorkspaceCreateController({
    workspace: new PgWorkspaceReposytory(),
    fileManager: new LocalFileManagerRepository(),
  })
}
