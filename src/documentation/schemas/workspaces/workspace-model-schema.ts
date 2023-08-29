export const workspaceModelSchema = {
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
    description: {
      type: 'string',
    },
    boards: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    members: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    profileImage: {
      type: 'string',
    },
    coverImage: {
      type: 'string',
    },
  },
}
