import { SignUpController } from "./sign-up-controller"
import { makeFakeAccount } from "@/mocks/account/make-fake-account"
import { httpError, httpReponse, httpRequest } from "@/helpers/http"
import { EmailValidator } from "@/protocols/models/validator/email-validator"

const makeSut = () => {
  const fakeRequest = httpRequest({
    ...makeFakeAccount(),
    passwordConfirmation: makeFakeAccount().password,
  })

  class EmailValidatorStub implements EmailValidator {
    validate(email: string) {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()

  const sut = new SignUpController({
    emailValidator: emailValidatorStub,
  })

  return {
    sut,
    emailValidatorStub,
    fakeRequest,
  }
}

describe('Account Controller', () => {
  test('Should controller called with correct values', () => {
    const { sut, fakeRequest } = makeSut()
    const controller = sut.handle(fakeRequest)

    expect(controller).toEqual(httpReponse(200, fakeRequest))
  })
  test('Should controller return 400 with e-mail not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.email = ''
    const controller = sut.handle(fakeRequest)

    expect(controller).toEqual(httpError(400, `Invalid param: email`))
  })
  test('Should controller return 400 with password not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.password = ''
    const controller = sut.handle(fakeRequest)

    expect(controller).toEqual(httpError(400, `Invalid param: password`))
  })
  test('Should controller return 400 with password confimation not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.passwordConfirmation = ''
    const controller = sut.handle(fakeRequest)

    expect(controller).toEqual(httpError(400, `Invalid param: passwordConfirmation`))
  })
  test('Should controller return 400 when password not equal to password confirmation', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.passwordConfirmation = 'other_password'
    const controller = sut.handle(fakeRequest)

    expect(controller).toEqual(httpError(400, `Invalid param: password`))
  })
  test('Should controller return 400 when email is invalid', async () => {
    const { sut, emailValidatorStub, fakeRequest } = makeSut()
    jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false)
    const controller = sut.handle(fakeRequest)
    expect(controller).toEqual(httpError(400, `Invalid param: email`))
  })
  test('Should call Email Validator with correct email param', async () => {
    const { sut, emailValidatorStub, fakeRequest } = makeSut()
    const validateSpy = jest.spyOn(emailValidatorStub, 'validate')
    sut.handle(fakeRequest)
    expect(validateSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
  test('Should return 500 if Email Validator throws', async () => {
    const { sut, emailValidatorStub, fakeRequest } = makeSut()
    jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const controller = sut.handle(fakeRequest)
    expect(controller).toEqual(httpError(500, 'Internal Server Error'))
  })
})
