import { CreateElementUpdateModel, ElementUpdateModel } from '@/protocols/models/element-update'
import { HTTPRequestParams } from '../models/http'

export interface ElementUpdate {
  create(params: CreateElementUpdateModel): Promise<ElementUpdateModel | undefined>
  getById(id: string): Promise<ElementUpdateModel | undefined>
  getAll(params: HTTPRequestParams): Promise<ElementUpdateModel[]>
  delete(id: string): Promise<boolean>
  setById(id: string, params: Partial<CreateElementUpdateModel>): Promise<ElementUpdateModel | undefined>
}
