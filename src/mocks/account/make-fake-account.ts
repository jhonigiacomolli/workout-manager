import { AccountModel } from "@/protocols/models/account";

export const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  address: 'valid_address',
  image: 'valid_image',
  teamId: undefined,
  phone: 'valid_phone',
  boards: [],
  desktops: [],
  permissions: [],
  responsability: [],
  status: [],
  tasks: [],
})
