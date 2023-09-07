export type BoardFormats = 'kanban' | 'gant' | 'table'

export type BoardModel = {
  id: string
  createdAt: string
  title: string
  format: BoardFormats
  groups: string[]
}
