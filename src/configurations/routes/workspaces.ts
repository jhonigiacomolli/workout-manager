import { Router } from 'express'

import { authentication } from '@/factories/middlewares'
import { useRouteController } from '@/helpers/http'

import {
  makeWorkspaceCreateController,
} from '@/factories/controllers'
import { makeWorkspaceLoadAllItemsController } from '@/factories/controllers/workspace/make-workspace-load-all-items-controller'

export default (router: Router) => {
  router.post('/workspaces', authentication, useRouteController(makeWorkspaceCreateController()))
  router.get('/workspaces', authentication, useRouteController(makeWorkspaceLoadAllItemsController()))
}
