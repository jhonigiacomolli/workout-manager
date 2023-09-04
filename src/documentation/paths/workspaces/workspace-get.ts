export const workspaceGetPath = {
  tags: ['Workspace'],
  summary: 'Request a workspace data by id',
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
      description: 'Workspace list successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/workspaceModel',
          },
        },
      },
    },
    400: {
      description: 'Workspace id is not provided',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/error',
          },
        },
      },
    },
    404: {
      description: 'Workspace not found',
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
