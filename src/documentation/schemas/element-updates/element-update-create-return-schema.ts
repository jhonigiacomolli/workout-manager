import { elementUpdateModelSchema } from './element-update-model-schema'

export const elementUpdateCreateReturnSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
    },
    data: elementUpdateModelSchema,
  },
}
