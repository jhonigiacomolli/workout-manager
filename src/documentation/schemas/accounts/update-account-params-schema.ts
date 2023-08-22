export const accountUpdateParamsSchema = {
  type: 'object',
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
    phone: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    temaId: {
      type: 'string',
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
    permissions: {
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
    boards: {
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
    image: {
      type: 'string',
    },
  },
}
