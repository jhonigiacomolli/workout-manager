export const elementUpdateUpdateParamsJsonSchema = {
  type: 'object',
  require: ['title'],
  properties: {
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

export const elementUpdateUpdateParamsMultipartSchema = {
  type: 'object',
  require: ['title'],
  properties: {
    content: {
      type: 'string',
    },
    user: {
      type: 'string',
    },
    'attachments[]': {
      type: 'array',
      items: {
        allOf: [
          {
            type: 'string',
            format: 'binary',
          },
          {
            type: 'string',
          },
        ],
      },
    },
  },
}
