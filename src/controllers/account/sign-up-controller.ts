import { InvalidParamError } from "@/helpers/errors/invalid-param";
import { AddAccountModel } from "@/protocols/use-cases/add-account";

export class SignUpController {
  create(addAccount: AddAccountModel): Promise<any> {
    const requiredParams = ['email', 'password', 'passwordConfirmation']

    for (let param of requiredParams) {
      if (!addAccount[param]) {
        return Promise.resolve(new InvalidParamError(param))
      }
    }

    if (addAccount.password !== addAccount.passwordConfirmation) {
      return Promise.resolve(new InvalidParamError('password'))
    }

    return Promise.resolve(addAccount)
  }
}
