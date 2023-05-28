import { SignUpController } from "./sign-up-controller"
import { InvalidParamError } from "@/helpers/errors/invalid-param"
import { makeFakeAccount } from "@/mocks/account/make-fake-account"
import { AddAccountModel } from "@/protocols/use-cases/add-account"

const makeSut = () => {
  const fakeAccount: AddAccountModel = {
    ...makeFakeAccount(),
    passwordConfirmation: makeFakeAccount().password,
  }
  const sut = new SignUpController()
  return {
    sut,
    fakeAccount,
  }
}

describe('Account Controller', () => {
  test('Should controller called with correct values', async () => {
    const { sut, fakeAccount } = makeSut()
    const controller = await sut.create(fakeAccount)

    expect(controller).toEqual(fakeAccount)
  })
  test('Should controller return 400 with e-mail not provided', async () => {
    const { sut, fakeAccount } = makeSut()
    const { email, ...fakeAccountWithoutEmail } = fakeAccount
    const controller = sut.create({ email: '', ...fakeAccountWithoutEmail })

    expect(controller).rejects.toThrowError(new InvalidParamError('email'))
  })
  test('Should controller return 400 with password not provided', async () => {
    const { sut, fakeAccount } = makeSut()
    const { password, ...fakeAccountWithoutEmail } = fakeAccount
    const controller = sut.create({ password: '', ...fakeAccountWithoutEmail })

    expect(controller).rejects.toThrowError(new InvalidParamError('password'))
  })
  test('Should controller return 400 with password confimation not provided', async () => {
    const { sut, fakeAccount } = makeSut()
    const { passwordConfirmation, ...fakeAccountWithoutEmail } = fakeAccount
    const controller = sut.create({ passwordConfirmation: '', ...fakeAccountWithoutEmail })

    expect(controller).rejects.toThrowError(new InvalidParamError('passwordConfirmation'))
  })
})
