import { Controller } from '@/protocols/models/controller'
import { PgGroupRepository } from '@/repositories/group/postgres-group-repository'
import { GroupLoadAllItemsController } from '@/controllers/group/group-load-all-items/group-load-all-items-controller'

export const makeGroupLoadAllItemsController = (): Controller => {
  return new GroupLoadAllItemsController({
    group: new PgGroupRepository(),
  })
}
