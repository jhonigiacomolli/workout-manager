import { Controller } from '@/protocols/models/controller'
import { PgElementRepository } from '@/repositories/element/postgres-element-repository'
import { ElementLoadItemController } from '@/controllers/element/element-load-item/element-load-item-controller'

export const makeElementLoadItemController = (): Controller => {
  return new ElementLoadItemController({
    element: new PgElementRepository(),
  })
}
