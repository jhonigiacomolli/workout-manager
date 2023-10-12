import { makeFakeElement } from './element-fakes'
import { Element } from '@/protocols/use-cases/element'
import { ElementModel } from '@/protocols/models/element'

export class ElementStub implements Element {
  async create(): Promise<ElementModel | undefined> {
    return Promise.resolve(makeFakeElement())
  }

  async setById(): Promise<ElementModel | undefined> {
    return Promise.resolve(makeFakeElement())
  }
}
