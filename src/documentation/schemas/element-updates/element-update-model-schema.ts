export const elementUpdateModelSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    elementId: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
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
  },
}
