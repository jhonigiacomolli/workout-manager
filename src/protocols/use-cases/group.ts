import { CreateGroupModel, GroupModel, UpdateGroupModel } from '@/protocols/models/group'
import { HTTPRequestParams } from '../models/http'

export interface Group {
  create(params: CreateGroupModel): Promise<GroupModel | undefined>
  getAll: (params: HTTPRequestParams) => Promise<GroupModel[]>
  getById(id: string): Promise<GroupModel | undefined>
  setById(id: string, params: Partial<UpdateGroupModel>): Promise<GroupModel | undefined>
}
