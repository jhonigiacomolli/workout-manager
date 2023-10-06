export const groupCreatePath = {
  tags: ['Group'],
  summary: 'Create new group',
  requestBody: {
    required: true,
    in: 'path',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/groupCreateParams',
        },
      },
      'multipart/form-data': {
        schema: {
          $ref: '#/schemas/groupCreateParams',
        },
      },
    },
  },
  responses: {
    200: {
      description: 'group created successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/groupCreateReturns',
          },
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/error',
          },
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/error',
          },
        },
      },
    },
  },
}
