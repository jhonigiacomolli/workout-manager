import { httpError, httpRequest } from "@/helpers/http"
import { makeFakeAccount } from "@/mocks/account/make-fake-account"
import { SignUpController } from "./sign-up-controller"

const makeSut = () => {
  const fakeAccount = httpRequest({
    ...makeFakeAccount(),
    passwordConfirmation: makeFakeAccount().password,
  })
  const sut = new SignUpController()
  return {
    sut,
    fakeAccount,
  }
}

describe('Account Controller', () => {
  test('Should controller called with correct values', async () => {
    const { sut, fakeAccount } = makeSut()
    const controller = await sut.handle(fakeAccount)

    expect(controller).toEqual(fakeAccount)
  })
  test('Should controller return 400 with e-mail not provided', async () => {
    const { sut, fakeAccount } = makeSut()
    fakeAccount.body.email = ''
    const controller = sut.handle(fakeAccount)

    expect(controller).resolves.toEqual(httpError(400, `Invalid param: email`))
  })
  test('Should controller return 400 with password not provided', async () => {
    const { sut, fakeAccount } = makeSut()
    fakeAccount.body.password = ''
    const controller = sut.handle(fakeAccount)

    expect(controller).resolves.toEqual(httpError(400, `Invalid param: password`))
  })
  test('Should controller return 400 with password confimation not provided', async () => {
    const { sut, fakeAccount } = makeSut()
    fakeAccount.body.passwordConfirmation = ''
    const controller = sut.handle(fakeAccount)

    expect(controller).resolves.toEqual(httpError(400, `Invalid param: passwordConfirmation`))
  })
  test('Should controller return 400 when password not equal to password confirmation', async () => {
    const { sut, fakeAccount } = makeSut()
    fakeAccount.body.passwordConfirmation = 'other_password'
    const controller = sut.handle(fakeAccount)

    expect(controller).resolves.toEqual(httpError(400, `Invalid param: password`))
  })
})
