export const boardModelSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    format: {
      type: 'string',
    },
    groups: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
}
