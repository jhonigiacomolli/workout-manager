export const workspaceCreateParamsSchema = {
  type: 'object',
  require: ['title'],
  properties: {
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
