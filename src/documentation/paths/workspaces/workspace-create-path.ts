export const workspaceCreatePath = {
  tags: ['Workspace'],
  summary: 'Create new workspace',
  requestBody: {
    required: true,
    in: 'path',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/workspaceCreateParams',
        },
      },
    },
  },
  responses: {
    200: {
      description: 'workspace created successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/workspaceCreateReturns',
          },
        },
      },
    },
    400: {
      description: 'Bad request',
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
