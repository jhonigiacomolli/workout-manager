export const groupModelSchema = {
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
    elements: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
}
