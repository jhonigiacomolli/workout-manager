import { makeFakeGroup } from './group-fakes'
import { Group } from '@/protocols/use-cases/group'
import { GroupModel } from '@/protocols/models/group'

export class GropuStub implements Group {
  async create(): Promise<GroupModel | undefined> {
    return Promise.resolve(makeFakeGroup())
  }
}
