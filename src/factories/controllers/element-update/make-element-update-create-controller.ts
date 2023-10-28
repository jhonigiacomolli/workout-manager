import { Controller } from '@/protocols/models/controller'
import { PgElementRepository } from '@/repositories/element/postgres-element-repository'
import { LocalFileManagerRepository } from '@/repositories/file-manager/local-file-manager'
import { PgElementUpdateRepository } from '@/repositories/element-update/postgres-element-update-repository'
import { ElementUpdateCreateController } from '@/controllers/element-update/element-update-create/element-update-create-controller'

export const makeElementUpdateCreateController = (): Controller => {
  return new ElementUpdateCreateController({
    respository: new PgElementUpdateRepository(),
    fileManager: new LocalFileManagerRepository(),
    element: new PgElementRepository(),
  })
}
