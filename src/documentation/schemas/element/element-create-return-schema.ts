import { elementModelSchema } from './element-model-schema'

export const elementCreateReturnSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
    },
    data: elementModelSchema,
  },
}
