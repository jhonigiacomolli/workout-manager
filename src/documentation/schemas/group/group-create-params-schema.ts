export const groupCreateParamsSchema = {
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
