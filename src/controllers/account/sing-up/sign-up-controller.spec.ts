import { type EmailValidator } from '@/protocols/models/validator/email-validator'

import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { SignUpController } from './sign-up-controller'
import { AccountStub } from '@/mocks/account/account-stub'
import { HasherStub } from '@/mocks/cryptography/hasher-stub'
import { makeFakeAccount } from '@/mocks/account/account-fakes'
import { BadRequestError, ForbiddenError, EmptyParamError, InvalidParamError } from '@/helpers/errors'
import { FileUploaderStub } from '@/mocks/file-uploader/file-uploader-stub'

const makeSut = () => {
  const fakeRequest = makeFakeRequest({
    body: {
      ...makeFakeAccount(),
      image: undefined,
      passwordConfirmation: makeFakeAccount().password,
    },
    files: {
      image: {
        filename: 'any-filename',
        mime: 'image/png',
        extension: '.png',
        data: 'any-image-data',
      },
    },
  })

  class EmailValidatorStub implements EmailValidator {
    validate() {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const accountStub = new AccountStub()
  const hasherStub = new HasherStub()
  const fileUploaderStub = new FileUploaderStub()

  const sut = new SignUpController({
    emailValidator: emailValidatorStub,
    account: accountStub,
    hasher: hasherStub,
    fileUploader: fileUploaderStub,
  })

  return {
    sut,
    accountStub,
    hasherStub,
    emailValidatorStub,
    fileUploaderStub,
    fakeRequest,
  }
}

describe('Sign Up Controller', () => {
  test('Should controller return 400 with name not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.name = ''

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new EmptyParamError('name'))
  })

  test('Should controller return 400 with e-mail not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.email = ''

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new EmptyParamError('email'))
  })

  test('Should controller return 400 with password not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.password = ''

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new EmptyParamError('password'))
  })

  test('Should controller return 400 with password confimation not provided', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.passwordConfirmation = ''

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new EmptyParamError('passwordConfirmation'))
  })

  test('Should controller return 400 when password not equal to password confirmation', async () => {
    const { sut, fakeRequest } = makeSut()
    fakeRequest.body.passwordConfirmation = 'other_password'

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('password and passwordConfirmation must be equal'))
  })

  test('Should call file uploader method with correct value if a image file is provided', async () => {
    const { sut, fakeRequest, fileUploaderStub } = makeSut()

    const fileUploaderSpy = jest.spyOn(fileUploaderStub, 'uploadImage')

    const fakeRequestWithoutFiles = {
      ...fakeRequest,
      files: {},
    }

    await sut.handle(fakeRequestWithoutFiles)

    expect(fileUploaderSpy).not.toHaveBeenCalled()

    await sut.handle(fakeRequest)

    expect(fileUploaderSpy).toHaveBeenCalledWith(fakeRequest.files.image)
  })

  test('Should controller return 400 when email is invalid', async () => {
    const { sut, emailValidatorStub, fakeRequest } = makeSut()
    jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false)

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new InvalidParamError('email'))
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

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should return 400 if e-mail already in use', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(true))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new ForbiddenError('E-mail already in use'))
  })

  test('Should Sign Up calls hash method with correct password', async () => {
    const { sut, accountStub, hasherStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(false))
    const hashSpy = jest.spyOn(hasherStub, 'generate')

    await sut.handle(fakeRequest)

    expect(hashSpy).toHaveBeenCalledWith(fakeRequest.body.password)
  })

  test('Should return 500 if cryptography hash mothod throws', async () => {
    const { sut, accountStub, hasherStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(false))
    jest.spyOn(hasherStub, 'generate').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should Sign Up calls account create method with correct values if file upload fails', async () => {
    const { sut, accountStub, hasherStub, fakeRequest, fileUploaderStub } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(false))
    jest.spyOn(fileUploaderStub, 'uploadImage').mockReturnValueOnce(Promise.resolve(null))
    jest.spyOn(hasherStub, 'generate').mockReturnValueOnce(Promise.resolve('hashed_password'))
    const accountSpy = jest.spyOn(accountStub, 'create')

    await sut.handle(fakeRequest)

    expect(accountSpy).toHaveBeenCalledWith({
      ...fakeRequest.body,
      image: '',
      password: 'hashed_password',
    })
  })

  test('Should Sign Up calls account create method with correct values', async () => {
    const { sut, accountStub, hasherStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(false))
    jest.spyOn(hasherStub, 'generate').mockReturnValueOnce(Promise.resolve('hashed_password'))
    const accountSpy = jest.spyOn(accountStub, 'create')

    await sut.handle(fakeRequest)

    expect(accountSpy).toHaveBeenCalledWith({
      ...fakeRequest.body,
      image: 'http://localhost/uploads/any-file-uploaded.png',
      password: 'hashed_password',
    })
  })

  test('Should return 500 if account create mothod throws', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(false))
    jest.spyOn(accountStub, 'create').mockImplementationOnce(() => { throw new Error() })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should return 200 if sign up succeeds', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(false))

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, {
      message: 'Successfully registered user',
      data: makeFakeAccount(),
    }))
  })

  test('Should return 200 and sign in succeeds and return a empty object case repository return dont have value', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()
    jest.spyOn(accountStub, 'checkEmailInUse').mockReturnValueOnce(Promise.resolve(false))
    jest.spyOn(accountStub, 'create').mockImplementationOnce(async () => { return await Promise.resolve(undefined as any) })

    const output = await sut.handle(fakeRequest)

    expect(output).toEqual(httpResponse(200, {
      message: 'Successfully registered user',
      data: {},
    }))
  })
})
