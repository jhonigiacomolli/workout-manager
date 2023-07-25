export const teamModelSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
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
