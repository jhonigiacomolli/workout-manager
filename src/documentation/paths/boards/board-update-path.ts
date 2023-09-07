export const boardUpdatePath = {
  tags: ['Board'],
  summary: 'Update wokspace',
  parameters: [
    {
      name: 'id',
      required: true,
      in: 'path',
      schema: {
        type: 'string',
      },
    },
  ],
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
      description: 'Board list successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
              data: {
                $ref: '#/schemas/boardModel',
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Bad Request',
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
