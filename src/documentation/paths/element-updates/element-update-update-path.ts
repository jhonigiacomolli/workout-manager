export const elementUpdateUpdatePath = {
  tags: ['Element Update'],
  summary: 'Update element update',
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
          $ref: '#/schemas/elementUpdateUpdateJsonParams',
        },
      },
      'multipart/form-data': {
        schema: {
          $ref: '#/schemas/elementUpdateUpdateMultipartParams',
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Element update list successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
              data: {
                $ref: '#/schemas/elementUpdateModel',
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
