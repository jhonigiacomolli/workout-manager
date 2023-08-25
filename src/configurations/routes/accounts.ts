import { Router } from 'express'

import { authentication } from '@/factories/middlewares'
import { useRouteController } from '@/helpers/http'

import {
  makeAccountLoadAllItemsController,
  makeAccountUpdateController,
  makeSignUpController,
} from '@/factories/controllers'

export default (router: Router) => {
  router.post('/sign-up', useRouteController(makeSignUpController()))
  router.get('/accounts', authentication, useRouteController(makeAccountLoadAllItemsController()))
  router.put('/accounts/:id', authentication, useRouteController(makeAccountUpdateController()))
}
