export const accountUpdatePath = {
  put: {
    tags: ['Account'],
    summary: 'Update an account',
    parameters: [
      {
        name: 'id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/accountModel',
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Account update successfully',
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
