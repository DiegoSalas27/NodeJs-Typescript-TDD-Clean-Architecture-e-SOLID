import { DbAddAccount } from '@data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '@infrastructure/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '@infrastructure/db/mongodb/account-repository/account'
import { LogMongoRepository } from '@infrastructure/db/mongodb/log-repository/log'
import { LogControllerDecorator } from '@main/decorators/log'
import { SignUpController } from '@presentation/controller/signup/signup'
import { Controller } from '@presentation/protocols'
import { EmailValidatorAdapter } from '@presentation/utils/email-validator-adapter'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount)
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
