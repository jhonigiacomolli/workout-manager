export const accountCreateParamsSchema = {
  type: 'object',
  require: ['name', 'email', 'password', 'passwordConfirmation'],
  properties: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    passwordConfirmation: {
      type: 'string',
    },
    image: {
      type: 'file',
    },
    phone: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    boards: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    reponsability: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    status: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    desktops: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    tasks: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    permissions: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
}
