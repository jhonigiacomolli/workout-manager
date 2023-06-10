import { httpResponse } from "@/helpers/http";
import { Controller } from "@/protocols/models/controller"
import { HTTPRequest, HTTPResponse } from "@/protocols/models/http";
import { Account } from "@/protocols/use-cases/account";

type ConstructorProps = {
  account: Account
}

export class SignInController implements Controller {
  constructor (private readonly dependencies: ConstructorProps) {}

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const requiredParams = ['username', 'password']

      const { username, password } = request.body

      for (let param of requiredParams) {
        if (!request.body[param]) {
          return httpResponse(400, `Empty param: ${param} is required`)
        }
      }

      const isValidUser = await this.dependencies.account.checkEmailInUse(username)

      if(!isValidUser) {
        return httpResponse(404, 'user not found')
      }

    return Promise.resolve(httpResponse(200, 'success'))
  }
}
