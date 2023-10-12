export const elementCreateParamsSchema = {
  type: 'object',
  require: ['title'],
  properties: {
    title: {
      type: 'string',
    },
    group: {
      type: 'string',
    },
    members: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    updates: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
}
