import { Router } from 'express'

import { useRouteController } from '@/helpers/http'
import { authentication } from '@/factories/middlewares'

import {
  makeAccountLoadAllItemsController,
  makeAccountRemoveController,
  makeAccountUpdateController,
  makeSignUpController,
} from '@/factories/controllers'

export default (router: Router) => {
  router.post('/sign-up', useRouteController(makeSignUpController()))
  router.get('/accounts', authentication, useRouteController(makeAccountLoadAllItemsController()))
  router.put('/accounts/:id', authentication, useRouteController(makeAccountUpdateController()))
  router.delete('/accounts/:id', authentication, useRouteController(makeAccountRemoveController()))
}
