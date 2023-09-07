export const accountCreateReturnSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
    },
    data: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        image: {
          type: 'string',
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
    },
  },
}
