import { Router } from 'express'

import { authentication } from '@/factories/middlewares'
import { useRouteController } from '@/helpers/http'

import {
  makeWorkspaceCreateController,
} from '@/factories/controllers'

export default (router: Router) => {
  router.post('/workspaces', authentication, useRouteController(makeWorkspaceCreateController()))
}
