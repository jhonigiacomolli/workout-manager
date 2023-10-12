export type ElementStatus = 'waiting' | 'started' | 'paused' | 'finished'

export type ElementModel = {
  id: string
  createdAt: string
  group: string
  title: string
  members: string[]
  status: ElementStatus
  startDate: string
  expectedDate: string
  endDate: string
  updates: string[]
}

export type CreateElementModel = {
  group: string
  title: string
  members: string[]
  status: ElementStatus
  startDate: string
  expectedDate: string
  endDate: string
  updates: string[]
}
