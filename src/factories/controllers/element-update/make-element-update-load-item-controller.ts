import { Controller } from '@/protocols/models/controller'
import { PgElementUpdateRepository } from '@/repositories/element-update/postgres-element-update-repository'
import { ElementUpdateLoadItemController } from '@/controllers/element-update/element-update-load-item/element-update-load-item-controller'

export const makeElementUpdateLoadItemController = (): Controller => {
  return new ElementUpdateLoadItemController({
    repository: new PgElementUpdateRepository(),
  })
}
