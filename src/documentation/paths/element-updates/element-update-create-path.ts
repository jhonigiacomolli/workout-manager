export const elementUpdateCreatePath = {
  tags: ['Element Update'],
  summary: 'Create new element update',
  requestBody: {
    required: true,
    in: 'path',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/elementUpdateCreateParams',
        },
      },
      'multipart/form-data': {
        schema: {
          $ref: '#/schemas/elementUpdateCreateParams',
        },
      },
    },
  },
  responses: {
    200: {
      description: 'element update created successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/elementUpdateCreateReturns',
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
