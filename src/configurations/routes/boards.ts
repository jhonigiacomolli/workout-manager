import { Router } from 'express'

import { authentication } from '@/factories/middlewares'
import { useRouteController } from '@/helpers/http'

import {
  makeBoardCreateController,
  makeBoardLoadAllItemsController,
  makeBoardLoadItemController,
  makeBoardRemoveController,
  makeBoardUpdateController,
} from '@/factories/controllers'

export default (router: Router) => {
  router.post('/boards', authentication, useRouteController(makeBoardCreateController()))
  router.get('/boards', authentication, useRouteController(makeBoardLoadAllItemsController()))
  router.get('/boards/:id', authentication, useRouteController(makeBoardLoadItemController()))
  router.put('/boards/:id', authentication, useRouteController(makeBoardUpdateController()))
  router.delete('/boards/:id', authentication, useRouteController(makeBoardRemoveController()))
}
