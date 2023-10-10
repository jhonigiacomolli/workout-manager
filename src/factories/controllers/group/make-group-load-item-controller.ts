import { Controller } from '@/protocols/models/controller'
import { PgGroupRepository } from '@/repositories/group/postgres-group-repository'
import { GroupLoadItemController } from '@/controllers/group/group-load-item/group-load-item-controller'

export const makeGroupLoadItemController = (): Controller => {
  return new GroupLoadItemController({
    group: new PgGroupRepository(),
  })
}
