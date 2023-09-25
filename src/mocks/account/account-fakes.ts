import { type AccountModel } from '@/protocols/models/account'

export const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  createdAt: '2023-06-30T03:00:00.000Z',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  address: 'valid_address',
  image: 'http://localhost/uploads/any-file-uploaded.png',
  teamId: undefined,
  phone: 'valid_phone',
  boards: [],
  desktops: [],
  permissions: [],
  responsability: [],
  status: [],
  tasks: [],
})

export const makePostgresFakeAccount = (): { created_at: string } & Omit<AccountModel, 'createdAt'> => ({
  id: 'valid_id',
  created_at: '2023-06-30T03:00:00.000Z',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  address: 'valid_address',
  image: 'http://localhost/uploads/any-file-uploaded.png',
  teamId: undefined,
  phone: 'valid_phone',
  boards: [],
  desktops: [],
  permissions: [],
  responsability: [],
  status: [],
  tasks: [],
})
