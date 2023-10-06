import { groupModelSchema } from './group-model-schema'

export const groupCreateRetunrSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
    },
    data: groupModelSchema,
  },
}
