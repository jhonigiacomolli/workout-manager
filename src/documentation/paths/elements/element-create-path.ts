export const elementCreatePath = {
  tags: ['Element'],
  summary: 'Create new element',
  requestBody: {
    required: true,
    in: 'path',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/elementCreateParams',
        },
      },
      'multipart/form-data': {
        schema: {
          $ref: '#/schemas/elementCreateParams',
        },
      },
    },
  },
  responses: {
    200: {
      description: 'element created successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/elementCreateReturns',
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
