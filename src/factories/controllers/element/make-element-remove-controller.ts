import { Controller } from '@/protocols/models/controller'
import { PgElementRepository } from '@/repositories/element/postgres-element-repository'
import { ElementRemoveController } from '@/controllers/element/element-remove/element-remove-controller'

export const makeElementRemoveController = (): Controller => {
  return new ElementRemoveController({
    element: new PgElementRepository(),
  })
}
