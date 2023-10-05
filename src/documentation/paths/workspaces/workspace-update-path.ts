export const workspaceUpdatePath = {
  tags: ['Workspace'],
  summary: 'Update wokspace',
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
  requestBody: {
    required: true,
    in: 'path',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/workspaceUpdateParams',
        },
      },
      'multipart/form-data': {
        schema: {
          $ref: '#/schemas/workspaceUpdateParamsMultipart',
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Workspace list successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
              data: {
                $ref: '#/schemas/workspaceModel',
              },
            },
          },
        },
      },
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
