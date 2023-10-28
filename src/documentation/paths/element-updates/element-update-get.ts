export const elementUpdateGetPath = {
  tags: ['Element Update'],
  summary: 'Request a element update data by id',
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
      description: 'Element update list successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/elementUpdateModel',
          },
        },
      },
    },
    400: {
      description: 'Element update id is not provided',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/error',
          },
        },
      },
    },
    404: {
      description: 'Element update not found',
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
