export const workspaceListPath = {
  tags: ['Workspace'],
  summary: 'List wokspaces',
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
      description: 'Workspace list successfully',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              $ref: '#/schemas/workspaceModel',
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
