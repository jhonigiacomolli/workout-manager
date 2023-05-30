import { EmailValidatorRepository } from "./email-validator-repository"

const makeSut = () => {
  const sut = new EmailValidatorRepository()
  return {
    sut
  }
}

describe('Email Validator Repository', () => {
  test('Should return false if invalid email is provided', () => {
    const { sut } = makeSut()
    const isValid = sut.validate('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
})
