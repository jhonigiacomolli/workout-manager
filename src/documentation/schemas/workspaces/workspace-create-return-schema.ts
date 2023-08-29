import { workspaceModelSchema } from './workspace-model-schema'

export const workspaceCreateRetunrSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
    },
    data: workspaceModelSchema,
  },
}
