export const elementListPath = {
  tags: ['Element'],
  summary: 'List elements',
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
      description: 'Element list successfully',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              $ref: '#/schemas/elementModel',
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
}
