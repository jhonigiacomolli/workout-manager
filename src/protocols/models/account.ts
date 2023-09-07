export type AccountModel = {
  id: string
  createdAt: string
  name: string
  email: string
  password: string
  phone: string
  address: string
  teamId?: string
  responsability: string[]
  status: string[]
  permissions: string[]
  desktops: string[]
  boards: string[]
  tasks: string[]
  image: string
}
