import { Router } from 'express'

import { useRouteController } from '@/helpers/http'
import { authentication } from '@/factories/middlewares'

import {
  makeTeamCreateController,
  makeTeamLoadAllItemsController,
  makeTeamLoadItemController,
} from '@/factories/controllers'

export default (router: Router) => {
  router.get('/teams', authentication, useRouteController(makeTeamLoadAllItemsController()))
  router.post('/teams', authentication, useRouteController(makeTeamCreateController()))
  router.get('/teams/:id', authentication, useRouteController(makeTeamLoadItemController()))
}
