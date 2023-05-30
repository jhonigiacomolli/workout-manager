import { SignUpController } from "./sign-up-controller"
import { makeFakeAccount } from "@/mocks/account/make-fake-account"
import { httpError, httpReponse, httpRequest } from "@/helpers/http"
import { EmailValidator } from "@/protocols/models/validator/email-validator"
import { Account, CreateAccountParams } from "@/protocols/use-cases/account"
import { Cryptography } from "@/protocols/use-cases/cryptography"

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
    async create(): Promise<{ accessToken: string }> {
      return Promise.resolve({
        accessToken: 'any_token'
      })
    }
    async checkEmailInUse(): Promise<boolean> {
      return Promise.resolve(false)
    }
  }

  class CryptographyStub implements Cryptography {
    encrypt(): Promise<string> {
      return Promise.resolve('encrypted_token')
    }
    hash(): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const accountStub = new AccountStub()
  const cryptographyStub = new CryptographyStub()

  const sut = new SignUpController({
    emailValidator: emailValidatorStub,
    account: accountStub,
    cryptography: cryptographyStub,
  })

  return {
    sut,
    accountStub,
    cryptographyStub,
    emailValidatorStub,
    fakeRequest,
  }
}

describe('Sign Up Controller', () => {
  test('Should controller called with correct values', async () => {
    const { sut, fakeRequest } = makeSut()
    const controller = await sut.handle(fakeRequest)

    expect(controller).toEqual(httpReponse(200, fakeRequest))
  })
  test('Should controller return 400 with e-mail not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.email = ''
    const controller = await sut.handle(fakeRequest)

    expect(controller).toEqual(httpError(400, `Invalid param: email`))
  })
  test('Should controller return 400 with password not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.password = ''
    const controller = await sut.handle(fakeRequest)

    expect(controller).toEqual(httpError(400, `Invalid param: password`))
  })
  test('Should controller return 400 with password confimation not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.passwordConfirmation = ''
    const controller = await sut.handle(fakeRequest)

    expect(controller).toEqual(httpError(400, `Invalid param: passwordConfirmation`))
  })
  test('Should controller return 400 when password not equal to password confirmation', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.passwordConfirmation = 'other_password'
    const controller = await sut.handle(fakeRequest)

    expect(controller).toEqual(httpError(400, `Invalid param: password`))
  })
  test('Should controller return 400 when email is invalid', async () => {
    const { sut, emailValidatorStub, fakeRequest } = makeSut()
    jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false)
    const controller = await sut.handle(fakeRequest)
    expect(controller).toEqual(httpError(400, `Invalid param: email`))
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
    expect(controller).toEqual(httpError(500, 'Internal Server Error'))
  })
  test('Should return 400 if e-mail already in use', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockImplementationOnce(() => { return Promise.resolve(true) })
    const controller = await sut.handle(fakeRequest)
    expect(controller).toEqual(httpError(403, 'E-mail already in use'))
  })
  test('Should Sign Up calls emailInUse with correct email', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()
    const checkEmailSpy = jest.spyOn(accountStub, 'checkEmailInUse')
    await sut.handle(fakeRequest)
    expect(checkEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
  test('Should Sign Up calls hash method with correct password', async () => {
    const { sut, cryptographyStub, fakeRequest } = makeSut()
    const hashSpy = jest.spyOn(cryptographyStub, 'hash')
    await sut.handle(fakeRequest)
    expect(hashSpy).toHaveBeenCalledWith(fakeRequest.body.password)
  })
  test('Should return 500 if cryptography hash mothod throws', async () => {
    const { sut, cryptographyStub, fakeRequest } = makeSut()
    jest.spyOn(cryptographyStub, 'hash').mockImplementationOnce(() => { throw new Error() })
    const controller = await sut.handle(fakeRequest)
    expect(controller).toEqual(httpError(500, 'Internal Server Error'))
  })
  test('Should Sign Up calls cryptography with correct values', async () => {
    const { sut, cryptographyStub, fakeRequest } = makeSut()
    const encryptSpy = jest.spyOn(cryptographyStub, 'encrypt')
    await sut.handle(fakeRequest)
    expect(encryptSpy).toHaveBeenCalledWith(fakeRequest.body.email, fakeRequest.body.password)
  })
  test('Should return 500 if cryptography encrypt mothod throws', async () => {
    const { sut, cryptographyStub, fakeRequest } = makeSut()
    jest.spyOn(cryptographyStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const controller = await sut.handle(fakeRequest)
    expect(controller).toEqual(httpError(500, 'Internal Server Error'))
  })
})
