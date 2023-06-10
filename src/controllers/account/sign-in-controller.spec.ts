import { httpRequest, httpResponse } from "@/helpers/http";
import { SignInController } from "./sign-in-controller";
import { response } from "express";

const makeSut = () => {
  const sut = new SignInController()
  const fakeRequest = httpRequest({
    username: 'any_username',
    password: 'any_password'
  })
  return {
    sut,
    fakeRequest,
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
  });
});
