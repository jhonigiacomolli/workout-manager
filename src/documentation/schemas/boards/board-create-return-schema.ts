import { boardModelSchema } from './board-model-schema'

export const boardCreateReturnSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
    },
    data: boardModelSchema,
  },
}
