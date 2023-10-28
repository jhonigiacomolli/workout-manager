import { Controller } from '@/protocols/models/controller'
import { PgElementUpdateRepository } from '@/repositories/element-update/postgres-element-update-repository'
import { ElementUpdateLoadAllItemsController } from '@/controllers/element-update/element-update-load-all-items/element-update-load-all-items-controller'

export const makeElementUpdateLoadAllItemsController = (): Controller => {
  return new ElementUpdateLoadAllItemsController({
    repository: new PgElementUpdateRepository(),
  })
}
