import { EmailValidatorRepository } from "./email-validator-repository"
import validator from 'email-validator'

const makeSut = () => {
  const sut = new EmailValidatorRepository()
  return {
    sut
  }
}

describe('Email Validator Repository', () => {
  test('Should Repository calls validate method with correct values', () => {
    const { sut } = makeSut()
    const validateSpy = jest.spyOn(validator, 'validate')
    sut.validate('any_email@mail.com')
    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('Should return false if invalid email is provided', () => {
    const { sut } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(false)
    const isValid = sut.validate('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
  test('Should return true if valid email is provided', () => {
    const { sut } = makeSut()
    const isValid = sut.validate('valid_email@mail.com')
    expect(isValid).toBe(true)
  })
})

