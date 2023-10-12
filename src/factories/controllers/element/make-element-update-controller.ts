import { Controller } from '@/protocols/models/controller'
import { PgElementRepository } from '@/repositories/element/postgres-element-repository'
import { ElementUpdateController } from '@/controllers/element/element-update/element-update-controller'

export const makeElementUpdateController = (): Controller => {
  return new ElementUpdateController({
    element: new PgElementRepository(),
  })
}
