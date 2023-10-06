import { CreateGroupModel, GroupModel } from '@/protocols/models/group'

export interface Group {
  create(params: CreateGroupModel): Promise<GroupModel | undefined>
}
