import { CreateElementUpdateModel, ElementUpdateModel } from '@/protocols/models/element-update'

export interface ElementUpdate {
  create(params: CreateElementUpdateModel): Promise<ElementUpdateModel | undefined>
}
