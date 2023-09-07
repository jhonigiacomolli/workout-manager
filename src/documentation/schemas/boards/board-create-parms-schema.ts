export const boardCreateParamsSchema = {
  type: 'object',
  require: ['title'],
  properties: {
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
