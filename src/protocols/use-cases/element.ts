import { CreateElementModel, ElementModel } from '@/protocols/models/element'

export interface Element {
  create: (params: CreateElementModel) => Promise<ElementModel | undefined>
}
