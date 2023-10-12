import { CreateElementModel, ElementModel } from '@/protocols/models/element'
import { HTTPRequestParams } from '../models/http'

export interface Element {
  create: (params: CreateElementModel) => Promise<ElementModel | undefined>
  delete: (id: string) => Promise<boolean>
  getAll: (params: HTTPRequestParams) => Promise<ElementModel[]>
  getById: (id: string) => Promise<ElementModel | undefined>
  setById: (id: string, params: Partial<CreateElementModel>) => Promise<ElementModel | undefined>
}
