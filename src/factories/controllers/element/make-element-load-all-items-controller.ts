import { Controller } from '@/protocols/models/controller'
import { PgElementRepository } from '@/repositories/element/postgres-element-repository'
import { ElementLoadAllItemsController } from '@/controllers/element/element-load-all-items/element-load-all-items-controller'

export const makeElementLoadAllItemsController = (): Controller => {
  return new ElementLoadAllItemsController({
    element: new PgElementRepository(),
  })
}
