import { Controller } from '@/protocols/models/controller'
import { PgGroupRepository } from '@/repositories/group/postgres-group-repository'
import { GroupRemoveController } from '@/controllers/group/group-remove/group-remove-controller'

export const makeGroupRemoveController = (): Controller => {
  return new GroupRemoveController({
    group: new PgGroupRepository(),
  })
}
