import { Router } from 'express'

import { authentication } from '@/factories/middlewares'
import { useRouteController } from '@/helpers/http'

import {
  makeWorkspaceCreateController, makeWorkspaceLoadAllItemsController, makeWorkspaceLoadItemController,
} from '@/factories/controllers'

export default (router: Router) => {
  router.post('/workspaces', authentication, useRouteController(makeWorkspaceCreateController()))
  router.get('/workspaces', authentication, useRouteController(makeWorkspaceLoadAllItemsController()))
  router.get('/workspaces/:id', authentication, useRouteController(makeWorkspaceLoadItemController()))
}
