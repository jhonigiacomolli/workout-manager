export const accountUpdatePath = {
  tags: ['Account'],
  summary: 'Update an account',
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
      description: 'Account update successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/accountCreateReturns',
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
