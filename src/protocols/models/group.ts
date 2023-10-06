export type GroupModel = {
  id: string
  createdAt: string
  title: string
  elements: string[]
}

export type CreateGroupModel = Omit<GroupModel, 'id' | 'createdAt'>

export type UpdateGroupModel = Partial<Omit<GroupModel, 'id' | 'createdAt'>>
