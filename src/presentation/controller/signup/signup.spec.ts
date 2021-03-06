import { MissingParamError, ServerError } from '@presentation/errors'
import { badRequest, ok, serverError } from '@presentation/helpers/http/http-helper'
import { SignUpController } from './signup'
import { AccountModel, AddAccount, AddAccountModel, HttpRequest, Validation } from './signup-protocols'

const makeAddAccount = (): AddAccount => {
  // factory
  class AddAccountStub implements AddAccount {
    // mocked object
    async add(account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  // factory
  class ValidationStub implements Validation {
    // mocked object
    validate(input: any): Error {
      // the input is generic for any request made
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

// const makeEmailValidatorWithError = (): EmailValidator => { // mockImplementationOnce can mock the Error return value
//   // factory
//   class EmailValidatorStub implements EmailValidator {
//     // mocked object
//     isValid(email: string): boolean {
//       throw new Error();
//     }
//   }
//   return new EmailValidatorStub();
// };

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error('messed up!')))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
    // expect(httpResponse.statusCode).toBe(500);
    // expect(httpResponse.body).toEqual(new ServerError(null));
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
    // expect(httpResponse.statusCode).toBe(200);
    // expect(httpResponse.body).toEqual(makeFakeAccount());
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
