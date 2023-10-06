export const groupRemovePath = {
  tags: ['Group'],
  summary: 'Remove an group',
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
  responses: {
    204: {
      description: 'Group removed',
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
