import { type EmailValidator } from '@/protocols/models/validator/email-validator'

import { SignUpController } from './sign-up-controller'
import { httpResponse, httpRequest } from '@/helpers/http'
import { AccountStub } from '@/mocks/account/account-stub'
import { HasherStub } from '@/mocks/cryptography/hasher-stub'
import { makeFakeAccount } from '@/mocks/account/make-fake-account'
import { BadRequestError, ForbiddenError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

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
    const controller = sut.handle(fakeRequest)

    await expect(controller).rejects.toThrow(new EmptyParamError('name'))
  })
  test('Should controller return 400 with e-mail not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.email = ''
    const controller = sut.handle(fakeRequest)

    await expect(controller).rejects.toThrow(new EmptyParamError('email'))
  })
  test('Should controller return 400 with password not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.password = ''
    const controller = sut.handle(fakeRequest)

    await expect(controller).rejects.toThrow(new EmptyParamError('password'))
  })
  test('Should controller return 400 with password confimation not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.passwordConfirmation = ''
    const controller = sut.handle(fakeRequest)

    await expect(controller).rejects.toThrow(new EmptyParamError('passwordConfirmation'))
  })
  test('Should controller return 400 when password not equal to password confirmation', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.passwordConfirmation = 'other_password'
    const controller = sut.handle(fakeRequest)

    await expect(controller).rejects.toThrow(new BadRequestError('password and passwordConfirmation must be equal'))
  })
  test('Should controller return 400 when email is invalid', async () => {
    const { sut, emailValidatorStub, fakeRequest } = makeSut()
    jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false)
    const controller = sut.handle(fakeRequest)
    await expect(controller).rejects.toThrow(new InvalidParamError('email'))
  })
  test('Should call Email Validator with correct email param', async () => {
    const { sut, emailValidatorStub, fakeRequest } = makeSut()
    const validateSpy = jest.spyOn(emailValidatorStub, 'validate')
    await sut.handle(fakeRequest)
    expect(validateSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
  test('Should Sign Up calls emailInUse with correct email', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()
    const checkEmailSpy = jest.spyOn(accountStub, 'checkEmailInUse')
    await sut.handle(fakeRequest)
    expect(checkEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
  test('Should return 500 if Email Validator throws', async () => {
    const { sut, emailValidatorStub, fakeRequest } = makeSut()
    jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => { throw new Error() })
    const controller = sut.handle(fakeRequest)
    await expect(controller).rejects.toThrow()
  })
  test('Should return 400 if e-mail already in use', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(true))
    const controller = sut.handle(fakeRequest)
    await expect(controller).rejects.toThrow(new ForbiddenError('E-mail already in use'))
  })

  test('Should Sign Up calls hash method with correct password', async () => {
    const { sut, accountStub, hasherStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockImplementationOnce(async () => { return await Promise.resolve(false) })
    const hashSpy = jest.spyOn(hasherStub, 'generate')
    await sut.handle(fakeRequest)
    expect(hashSpy).toHaveBeenCalledWith(fakeRequest.body.password)
  })
  test('Should return 500 if cryptography hash mothod throws', async () => {
    const { sut, accountStub, hasherStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockImplementationOnce(async () => { return await Promise.resolve(false) })
    jest.spyOn(hasherStub, 'generate').mockImplementationOnce(() => { throw new Error() })
    const controller = sut.handle(fakeRequest)
    await expect(controller).rejects.toThrow()
  })
  test('Should Sign Up calls account create method with correct values', async () => {
    const { sut, accountStub, hasherStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockImplementationOnce(async () => { return await Promise.resolve(false) })
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
    jest.spyOn(accountStub, 'checkEmailInUse').mockImplementationOnce(async () => { return await Promise.resolve(false) })
    jest.spyOn(accountStub, 'create').mockImplementationOnce(() => { throw new Error() })
    const controller = sut.handle(fakeRequest)
    await expect(controller).rejects.toThrow()
  })
  test('Should return 200 if sign up succeeds', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockImplementationOnce(async () => { return await Promise.resolve(false) })
    const controller = await sut.handle(fakeRequest)
    expect(controller).toEqual(httpResponse(200, {
      message: 'Successfully registered user',
      data: makeFakeAccount(),
    }))
  })
  test('Should return 200 and sign in succeeds and return a empty object case repository return dont have value', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockImplementationOnce(async () => { return await Promise.resolve(false) })
    jest.spyOn(accountStub, 'create').mockImplementationOnce(async () => { return await Promise.resolve(undefined as any) })
    const controller = await sut.handle(fakeRequest)
    expect(controller).toEqual(httpResponse(200, {
      message: 'Successfully registered user',
      data: {},
    }))
  })
})
