import { Router } from 'express'

import { authentication } from '@/factories/middlewares'
import { useRouteController } from '@/helpers/http'

import {
  makeGroupCreateController,
  makeGroupLoadAllItemsController,
  makeGroupLoadItemController,
  makeGroupRemoveController,
  makeGroupUpdateController,
} from '@/factories/controllers'

export default (router: Router) => {
  router.post('/groups', authentication, useRouteController(makeGroupCreateController()))
  router.get('/groups', authentication, useRouteController(makeGroupLoadAllItemsController()))
  router.get('/groups/:id', authentication, useRouteController(makeGroupLoadItemController()))
  router.put('/groups/:id', authentication, useRouteController(makeGroupUpdateController()))
  router.delete('/groups/:id', authentication, useRouteController(makeGroupRemoveController()))
}
