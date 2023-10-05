export const workspaceUpdateParamsSchemaJson = {
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
      type: 'file',
    },
    coverImage: {
      type: 'file',
    },
  },
}

export const workspaceUpdateParamsSchemaMultipart = {
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
      type: 'file',
    },
    coverImage: {
      type: 'file',
    },
  },
}
