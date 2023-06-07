import { SignUpController } from "./sign-up-controller"
import { httpResponse, httpRequest } from "@/helpers/http"
import { makeFakeAccount } from "@/mocks/account/make-fake-account"
import { Hasher } from "@/protocols/use-cases/cryptography/hashser"
import { Account, CreateAccountParams } from "@/protocols/use-cases/account"
import { EmailValidator } from "@/protocols/models/validator/email-validator"

const makeSut = () => {
  const fakeRequest = httpRequest({
    ...makeFakeAccount(),
    passwordConfirmation: makeFakeAccount().password,
  })

  class EmailValidatorStub implements EmailValidator {
    validate() {
      return true
    }
  }

  class AccountStub implements Account {
    async create(): Promise<boolean> {
      return Promise.resolve(true)
    }

    async checkEmailInUse(): Promise<boolean> {
      return Promise.resolve(false)
    }
  }

  class HasherStub implements Hasher {
    generate(): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const accountStub = new AccountStub()
  const hasherStub = new HasherStub()

  const sut = new SignUpController({
    emailValidator: emailValidatorStub,
    account: accountStub,
    hasher: hasherStub,
  })

  return {
    sut,
    accountStub,
    hasherStub,
    emailValidatorStub,
    fakeRequest,
  }
}

describe('Sign Up Controller', () => {
  test('Should controller return 400 with name not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.name = ''
    const controller = await sut.handle(fakeRequest)

    expect(controller).toEqual(httpResponse(400, `Empty param: name is required`))
  })
  test('Should controller return 400 with e-mail not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.email = ''
    const controller = await sut.handle(fakeRequest)

    expect(controller).toEqual(httpResponse(400, `Empty param: email is required`))
  })
  test('Should controller return 400 with password not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.password = ''
    const controller = await sut.handle(fakeRequest)

    expect(controller).toEqual(httpResponse(400, `Empty param: password is required`))
  })
  test('Should controller return 400 with password confimation not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.passwordConfirmation = ''
    const controller = await sut.handle(fakeRequest)

    expect(controller).toEqual(httpResponse(400, `Empty param: passwordConfirmation is required`))
  })
  test('Should controller return 400 when password not equal to password confirmation', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.passwordConfirmation = 'other_password'
    const controller = await sut.handle(fakeRequest)

    expect(controller).toEqual(httpResponse(400, `password and passwordConfirmation must be equal`))
  })
  test('Should controller return 400 when email is invalid', async () => {
    const { sut, emailValidatorStub, fakeRequest } = makeSut()
    jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false)
    const controller = await sut.handle(fakeRequest)
    expect(controller).toEqual(httpResponse(400, `Invalid param: email`))
  })
  test('Should call Email Validator with correct email param', async () => {
    const { sut, emailValidatorStub, fakeRequest } = makeSut()
    const validateSpy = jest.spyOn(emailValidatorStub, 'validate')
    await sut.handle(fakeRequest)
    expect(validateSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
  test('Should return 500 if Email Validator throws', async () => {
    const { sut, emailValidatorStub, fakeRequest } = makeSut()
    jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const controller = await sut.handle(fakeRequest)
    expect(controller).toEqual(httpResponse(500, 'Internal Server Error'))
  })
  test('Should return 400 if e-mail already in use', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockImplementationOnce(() => { return Promise.resolve(true) })
    const controller = await sut.handle(fakeRequest)
    expect(controller).toEqual(httpResponse(403, 'E-mail already in use'))
  })
  test('Should Sign Up calls emailInUse with correct email', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()
    const checkEmailSpy = jest.spyOn(accountStub, 'checkEmailInUse')
    await sut.handle(fakeRequest)
    expect(checkEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
  test('Should Sign Up calls hash method with correct password', async () => {
    const { sut, hasherStub, fakeRequest } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'generate')
    await sut.handle(fakeRequest)
    expect(hashSpy).toHaveBeenCalledWith(fakeRequest.body.password)
  })
  test('Should return 500 if cryptography hash mothod throws', async () => {
    const { sut, hasherStub, fakeRequest } = makeSut()
    jest.spyOn(hasherStub, 'generate').mockImplementationOnce(() => { throw new Error() })
    const controller = await sut.handle(fakeRequest)
    expect(controller).toEqual(httpResponse(500, 'Internal Server Error'))
  })
  test('Should Sign Up calls account create method with correct values', async () => {
    const { sut, accountStub, hasherStub, fakeRequest } = makeSut()
    jest.spyOn(hasherStub, 'generate').mockReturnValueOnce(Promise.resolve('hashed_password'))
    const accountSpy = jest.spyOn(accountStub, 'create')
    await sut.handle(fakeRequest)
    expect(accountSpy).toHaveBeenCalledWith({
      ...fakeRequest.body,
      password: 'hashed_password',
    })
  })
  test('Should return 500 if account create mothod throws', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'create').mockImplementationOnce(() => { throw new Error() })
    const controller = await sut.handle(fakeRequest)
    expect(controller).toEqual(httpResponse(500, 'Internal Server Error'))
  })
  test('Should return 200 if sign up succeeds', async () => {
    const { sut, fakeRequest } = makeSut()
    const controller = await sut.handle(fakeRequest)
    expect(controller).toEqual(httpResponse(200, 'Successfully registered user'))
  })
})
