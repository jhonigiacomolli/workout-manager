import { Router } from 'express'

import { authentication } from '@/factories/middlewares'
import { useRouteController } from '@/helpers/http'

import {
  makeElementUpdateCreateController,
  makeElementUpdateLoadAllItemsController,
  makeElementUpdateLoadItemController,
  makeElementUpdateRemoveController,
  makeElementUpdateUpdateController,
} from '@/factories/controllers'

export default (router: Router) => {
  router.post('/element-updates', authentication, useRouteController(makeElementUpdateCreateController()))
  router.get('/element-updates', authentication, useRouteController(makeElementUpdateLoadAllItemsController()))
  router.get('/element-updates/:id', authentication, useRouteController(makeElementUpdateLoadItemController()))
  router.put('/element-updates/:id', authentication, useRouteController(makeElementUpdateUpdateController()))
  router.delete('/element-updates/:id', authentication, useRouteController(makeElementUpdateRemoveController()))
}
