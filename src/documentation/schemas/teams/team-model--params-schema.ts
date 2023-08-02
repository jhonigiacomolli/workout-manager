export const teamModelParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    members: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
}
