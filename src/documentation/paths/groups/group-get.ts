export const groupGetPath = {
  tags: ['Group'],
  summary: 'Request a group data by id',
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
      description: 'Group list successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/groupModel',
          },
        },
      },
    },
    400: {
      description: 'Group id is not provided',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/error',
          },
        },
      },
    },
    404: {
      description: 'Group not found',
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
