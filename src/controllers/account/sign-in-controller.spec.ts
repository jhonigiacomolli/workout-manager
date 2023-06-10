import { httpRequest, httpResponse } from "@/helpers/http";
import { SignInController } from "./sign-in-controller";
import { response } from "express";
import { Account } from "@/protocols/use-cases/account";

const makeSut = () => {
  class AccountStub implements Account {
    async create(): Promise<boolean> {
      return Promise.resolve(true)
    }

    async checkEmailInUse(): Promise<boolean> {
      return Promise.resolve(false)
    }
  }

  const accountStub = new AccountStub()
  const sut = new SignInController({
    account: accountStub
  })
  const fakeRequest = httpRequest({
    username: 'any_username',
    password: 'any_password'
  })
  return {
    sut,
    fakeRequest,
    accountStub,
  }
}

describe('Sign in', () => {
  test('Should return 400 if no username is provided', async () => {
    const { sut, fakeRequest } = makeSut()
    const response = await sut.handle({
       ...fakeRequest,
        body: {
          ...fakeRequest.body,
          username: '',
      }
    })
    expect(response).toEqual(httpResponse(400, 'Empty param: username is required'))
  });
  test('Should return 400 if no passwrod is provided', async () => {
    const { sut, fakeRequest } = makeSut()
    const response = await sut.handle({
      ...fakeRequest,
       body: {
         ...fakeRequest.body,
         password: '',
      }
    })
    expect(response).toEqual(httpResponse(400, 'Empty param: password is required'))
  })
  test('Should return 404 if username is not registed', async () => {
    const { sut, fakeRequest, accountStub } = makeSut()
    const response = await sut.handle(fakeRequest)
    jest.spyOn(accountStub, 'checkEmailInUse').mockImplementationOnce(() => { return Promise.resolve(false) })
    expect(response).toEqual(httpResponse(404, 'user not found'))
  });
});
