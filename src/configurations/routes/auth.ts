import { Router } from 'express'
import { useRouteController } from '@/helpers/http'

import {
  makeRefreshTokenController,
  makeSignInController,
} from '@/factories/controllers'

export default (router: Router) => {
  router.post('/sign-in', useRouteController(makeSignInController()))
  router.post('/refresh-token', useRouteController(makeRefreshTokenController()))
}
