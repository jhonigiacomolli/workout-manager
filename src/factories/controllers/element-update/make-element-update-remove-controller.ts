import { Controller } from '@/protocols/models/controller'
import { LocalFileManagerRepository } from '@/repositories/file-manager/local-file-manager'
import { PgElementUpdateRepository } from '@/repositories/element-update/postgres-element-update-repository'
import { ElementUpdateRemoveController } from '@/controllers/element-update/element-update-remove/element-update-remove-controller'

export const makeElementUpdateRemoveController = (): Controller => {
  return new ElementUpdateRemoveController({
    repository: new PgElementUpdateRepository(),
    fileManager: new LocalFileManagerRepository(),
  })
}
