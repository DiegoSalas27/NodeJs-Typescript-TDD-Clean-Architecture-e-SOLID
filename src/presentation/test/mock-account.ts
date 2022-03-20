import { AccountModel } from '@domain/models/account'
import { mockAccountModel } from '@domain/test'
import { AddAccount, AddAccountParams } from '@domain/usecases/account/add-account'
import { Authentication, AuthenticationParams, AuthenticationResponse } from '@domain/usecases/account/authentication'
import faker from '@faker-js/faker'
import { LoadAccountByToken } from '@presentation/middlewares/auth-middleware-protocols'

export class AddAccountSpy implements AddAccount {
  accountModel = mockAccountModel()
  addAccountParams: AddAccountParams

  async add(account: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = account
    return this.accountModel
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  authenticationModel = {
    accessToken: faker.random.uuid(),
    name: faker.name.findName()
  }

  async auth(authenticationParams: AuthenticationParams): Promise<AuthenticationResponse> {
    this.authenticationParams = authenticationParams
    return this.authenticationModel
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel = mockAccountModel()
  accessToken: string
  role: string

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return this.accountModel
  }
}
