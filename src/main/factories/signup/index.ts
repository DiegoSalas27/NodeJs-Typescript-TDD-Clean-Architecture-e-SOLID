import { DbAddAccount } from '@data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '@infrastructure/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '@infrastructure/db/mongodb/account-repository/account'
import { LogMongoRepository } from '@infrastructure/db/mongodb/log-repository/log'
import { LogControllerDecorator } from '@main/decorators/log'
import { SignUpController } from '@presentation/controller/signup/signup'
import { Controller } from '@presentation/protocols'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation())
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
