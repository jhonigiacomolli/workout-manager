import { InvalidParamError } from "@/helpers/errors/invalid-param";
import { AddAccountModel } from "@/protocols/use-cases/add-account";

export class SignUpController {
  create(addAccount: AddAccountModel): Promise<any> {
    const requiredParams = ['email', 'password', 'passwordConfirmation']

    for (let param of requiredParams) {
      if (!addAccount[param]) {
        return Promise.reject(new InvalidParamError(param))
      }
    }
    return Promise.resolve(addAccount)
  }
}
