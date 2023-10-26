export type ElementUpdateModel = {
  id: string
  elementId: string
  createdAt: string
  updatedAt: string
  user: string
  content: string
  attachments: string[]
}

export type CreateElementUpdateModel = Omit<ElementUpdateModel, 'id' | 'createdAt' | 'updatedAt'>
