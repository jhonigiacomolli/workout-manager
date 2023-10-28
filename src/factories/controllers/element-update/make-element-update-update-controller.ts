import { Controller } from '@/protocols/models/controller'
import { LocalFileManagerRepository } from '@/repositories/file-manager/local-file-manager'
import { PgElementUpdateRepository } from '@/repositories/element-update/postgres-element-update-repository'
import { ElementUpdateUpdateController } from '@/controllers/element-update/element-update-update/element-update-update-controller'

export const makeElementUpdateUpdateController = (): Controller => {
  return new ElementUpdateUpdateController({
    repository: new PgElementUpdateRepository(),
    fileManager: new LocalFileManagerRepository(),
  })
}
