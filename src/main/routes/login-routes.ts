import { adaptRoute } from '@main/adapters/express/express-route-adapter'
import { makeLoginController } from '@main/factories/login'
import { makeSignUpController } from '@main/factories/signup'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
