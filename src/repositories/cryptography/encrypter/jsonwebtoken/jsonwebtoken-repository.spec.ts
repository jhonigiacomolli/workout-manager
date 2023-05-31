import jwt from 'jsonwebtoken'
import { JsonwebtokenRepository } from "./jsonwebtoken-repository"

const makeSut = () => new JsonwebtokenRepository()

process.env.JWT_SECURE_KEY = 'secret-key'

describe('Json WebToken Repository', () => {
  test('Should Repository is called with correct value', async () => {
    const sut = makeSut()
    const jsonSpy = jest.spyOn(jwt, 'sign')
    const token = await sut.encrypt('any_id')
    expect(jsonSpy).toHaveBeenCalledWith('any_id', 'secret-key')
    expect(typeof token).toBe('string')
    expect(token).not.toBe('')
  })

  test('Should Repository return 500 with secret is not set', async () => {
    const sut = makeSut();
    delete process.env.JWT_SECURE_KEY
    await expect(sut.encrypt('any_id')).rejects.toThrowError('')
  })
})
