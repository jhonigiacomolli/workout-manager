import { Controller } from '@/protocols/models/controller'
import { PgGroupRepository } from '@/repositories/group/postgres-group-repository'
import { GroupUpdateController } from '@/controllers/group/group-update/group-update-controller'

export const makeGroupUpdateController = (): Controller => {
  return new GroupUpdateController({
    group: new PgGroupRepository(),
  })
}
