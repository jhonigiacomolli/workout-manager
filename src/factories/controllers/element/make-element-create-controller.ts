import { Controller } from '@/protocols/models/controller'
import { PgElementRepository } from '@/repositories/element/postgres-element-repository'
import { ElementCreateController } from '@/controllers/element/element-create/element-create-controller'

export const makeElementCreateController = (): Controller => {
  return new ElementCreateController({
    element: new PgElementRepository(),
  })
}
