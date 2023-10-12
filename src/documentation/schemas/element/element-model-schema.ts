export const elementModelSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    group: {
      type: 'string',
    },
    members: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    status: {
      type: 'string',
    },
    expectedDate: {
      type: 'string',
    },
    startDate: {
      type: 'string',
    },
    endDate: {
      type: 'string',
    },
    updates: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
}
