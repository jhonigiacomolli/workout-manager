import { ElementUpdateModel } from '@/protocols/models/element-update'

export const makeFakeElementUpdate = (): ElementUpdateModel => ({
  id: 'any-id',
  createdAt: '12/10/2023',
  updatedAt: '12/10/2023',
  user: 'any=user',
  content: 'any-update-content',
  attachments: [],
})
