export const teamGetPath = {
  get: {
    tags: ['Team'],
    summary: 'Request a team data',
    parameters: [
      {
        name: 'id',
        in: 'path',
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: {
        description: 'Team requested successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/teamModel',
            },
          },
        },
      },
      400: {
        description: 'Team id is not provided',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/error',
            },
          },
        },
      },
      404: {
        description: 'Team not found',
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
