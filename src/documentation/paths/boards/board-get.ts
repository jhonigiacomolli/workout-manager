export const boardGetPath = {
  tags: ['Board'],
  summary: 'Request a board data by id',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
      },
    },
  ],
  responses: {
    200: {
      description: 'Workspace request successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/boardModel',
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
    404: {
      description: 'Workspace not found',
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
