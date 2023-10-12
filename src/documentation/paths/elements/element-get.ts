export const elementGetPath = {
  tags: ['Element'],
  summary: 'Request a element data by id',
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
      description: 'Element list successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/elementModel',
          },
        },
      },
    },
    400: {
      description: 'Element id is not provided',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/error',
          },
        },
      },
    },
    404: {
      description: 'Element not found',
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
