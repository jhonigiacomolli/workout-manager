export const elementUpdateCreateParamsSchema = {
  type: 'object',
  require: ['title'],
  properties: {
    content: {
      type: 'string',
    },
    elementId: {
      type: 'string',
    },
    user: {
      type: 'string',
    },
    'attachments[]': {
      type: 'array',
      items: {
        type: 'file',
        format: 'binary',
      },
    },
  },
}
