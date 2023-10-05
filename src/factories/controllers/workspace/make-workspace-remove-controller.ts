import { Controller } from '@/protocols/models/controller'
import { LocalFileManagerRepository } from '@/repositories/file-manager/local-file-manager'
import { PgWorkspaceReposytory } from '@/repositories/workspace/postgres-workspace-repository'
import { WorkspaceRemoveController } from '@/controllers/workspace/workspace-remove/workspace-remove-controller'

export const makeWorkspaceRemoveController = (): Controller => {
  return new WorkspaceRemoveController({
    workspace: new PgWorkspaceReposytory(),
    fileManager: new LocalFileManagerRepository(),
  })
}
