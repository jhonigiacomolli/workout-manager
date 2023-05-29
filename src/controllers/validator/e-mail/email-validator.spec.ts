import { EmailValidatorController } from "./email-validator"

const makeSut = () => {
  return new EmailValidatorController()
}

describe('Email Validator', () => {
  test('Should validate method have been called with correct value', () => {
    const sut = makeSut()
    const emailValidatorSpy = jest.spyOn(sut, 'validate')
    sut.validate('valid_email')
    expect(emailValidatorSpy).toHaveBeenCalledWith('valid_email')
  })
})
