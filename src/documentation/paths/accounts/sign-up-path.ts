export const signUpPath = {
  post: {
    tags: ['Account'],
    summary: 'Create new account',
    consumes: [
      'multipart/formdata',
    ],
    requestBody: {
      required: true,
      in: 'path',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/accountCreateParams',
          },
        },
        'multipart/formdata': {
          schema: {
            $ref: '#/schemas/accountCreateParams',
          },
        },
      },
    },
    security: [],
    responses: {
      200: {
        description: 'Account created successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/accountCreateReturns',
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
