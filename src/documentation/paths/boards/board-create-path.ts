export const boardCreatePath = {
  tags: ['Board'],
  summary: 'Create new board',
  requestBody: {
    required: true,
    in: 'path',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/boardCreateParams',
        },
      },
    },
  },
  responses: {
    200: {
      description: 'board created successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/boardCreateReturns',
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
