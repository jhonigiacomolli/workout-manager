export const accountListPath = {
  get: {
    tags: ['Account'],
    summary: 'List accounts',
    parameters: [
      {
        name: 'limit',
        in: 'query',
        schema: {
          type: 'string',
        },
      }, {
        name: 'page',
        in: 'query',
        schema: {
          type: 'integer',
        },
      },
      {
        name: 'order',
        in: 'query',
        schema: {
          type: 'string',
        },
      },
      {
        name: 'orderBy',
        in: 'query',
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: {
        description: 'Account list successfully',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                id: {
                  type: 'string',
                },
                $ref: '#/schemas/accountModel',
              },
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
