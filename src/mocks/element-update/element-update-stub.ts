import { makeFakeElementUpdate } from './element-update-fakes'
import { ElementUpdate } from '@/protocols/use-cases/element-update'
import { ElementUpdateModel } from '@/protocols/models/element-update'

export class ElementUpdateStub implements ElementUpdate {
  async create(): Promise<ElementUpdateModel | undefined> {
    return Promise.resolve(makeFakeElementUpdate())
  }

  async delete(): Promise<boolean> {
    return Promise.resolve(true)
  }

  async getById(): Promise<ElementUpdateModel | undefined> {
    return Promise.resolve(makeFakeElementUpdate())
  }

  async getAll(): Promise<ElementUpdateModel[]> {
    return Promise.resolve([makeFakeElementUpdate()])
  }

  async setById(): Promise<ElementUpdateModel | undefined> {
    return Promise.resolve(makeFakeElementUpdate())
  }
}
