import { Controller } from '@/protocols/models/controller'
import { PgGroupRepository } from '@/repositories/group/postgres-group-repository'
import { GroupCreateController } from '@/controllers/group/group-create/group-create-controller'

export const makeGroupCreateController = (): Controller => {
  return new GroupCreateController({
    group: new PgGroupRepository(),
  })
}
