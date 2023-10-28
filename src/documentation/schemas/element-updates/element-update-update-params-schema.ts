export const elementUpdateUpdateParamsSchema = {
  type: 'object',
  require: ['title'],
  properties: {
    content: {
      type: 'string',
    },
    user: {
      type: 'string',
    },
    attachments: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    'attachments[]': {
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
  },
}
