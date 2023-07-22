export const accountRemovePath = {
  delete: {
    tags: ['Account'],
    summary: 'Remove an account',
    parameters: [
      {
        name: 'id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      204: {
        description: 'Account removed successfully',
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
  },
}
