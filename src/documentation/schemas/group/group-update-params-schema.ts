export const groupUpdateParamsSchema = {
  type: 'object',
  require: ['title'],
  properties: {
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
