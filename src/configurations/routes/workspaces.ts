import { Router } from 'express'

import { authentication } from '@/factories/middlewares'
import { useRouteController } from '@/helpers/http'

import {
  makeWorkspaceCreateController,
  makeWorkspaceLoadAllItemsController,
  makeWorkspaceLoadItemController,
  makeWorkspaceRemoveController,
  makeWorkspaceUpdateController,
} from '@/factories/controllers'

export default (router: Router) => {
  router.post('/workspaces', authentication, useRouteController(makeWorkspaceCreateController()))
  router.get('/workspaces', authentication, useRouteController(makeWorkspaceLoadAllItemsController()))
  router.get('/workspaces/:id', authentication, useRouteController(makeWorkspaceLoadItemController()))
  router.put('/workspaces/:id', authentication, useRouteController(makeWorkspaceUpdateController()))
  router.delete('/workspaces/:id', authentication, useRouteController(makeWorkspaceRemoveController()))
}
