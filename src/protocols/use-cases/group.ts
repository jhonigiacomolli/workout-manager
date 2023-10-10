import { CreateGroupModel, GroupModel, UpdateGroupModel } from '@/protocols/models/group'

export interface Group {
  create(params: CreateGroupModel): Promise<GroupModel | undefined>
  getById(id: string): Promise<GroupModel | undefined>
  setById(id: string, params: Partial<UpdateGroupModel>): Promise<GroupModel | undefined>
}
