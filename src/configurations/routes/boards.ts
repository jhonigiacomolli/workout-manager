import { Router } from 'express'

import { authentication } from '@/factories/middlewares'
import { useRouteController } from '@/helpers/http'

import {
  makeBoardCreateController,
} from '@/factories/controllers'

export default (router: Router) => {
  router.post('/boards', authentication, useRouteController(makeBoardCreateController()))
}
