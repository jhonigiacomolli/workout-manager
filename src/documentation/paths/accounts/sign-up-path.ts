export const signUpPath = {
  post: {
    tags: ['Account'],
    summary: 'Create new account',
    requestBody: {
      required: true,
      in: 'path',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/accountUpdateParams',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Account created successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/message',
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
  },
}
