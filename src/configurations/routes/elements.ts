import { Router } from 'express'

import { authentication } from '@/factories/middlewares'
import { useRouteController } from '@/helpers/http'

import {
  makeElementCreateController,
  makeElementLoadAllItemsController,
  makeElementLoadItemController,
  makeElementRemoveController,
  makeElementUpdateController,
} from '@/factories/controllers'

export default (router: Router) => {
  router.post('/elements', authentication, useRouteController(makeElementCreateController()))
  router.get('/elements', authentication, useRouteController(makeElementLoadAllItemsController()))
  router.get('/elements/:id', authentication, useRouteController(makeElementLoadItemController()))
  router.put('/elements/:id', authentication, useRouteController(makeElementUpdateController()))
  router.delete('/elements/:id', authentication, useRouteController(makeElementRemoveController()))
}
