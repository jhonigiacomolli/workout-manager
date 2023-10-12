import { ElementModel } from '@/protocols/models/element'

export const makeFakeElement = (): ElementModel => ({
  id: 'any-id',
  createdAt: '12/10/2023',
  endDate: '',
  startDate: '',
  expectedDate: '',
  status: 'waiting',
  group: 'any-group',
  members: [],
  title: 'any-element-title',
  updates: [],
})
