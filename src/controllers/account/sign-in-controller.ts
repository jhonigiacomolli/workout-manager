import { httpResponse } from "@/helpers/http";
import { Controller } from "@/protocols/models/controller"
import { HTTPRequest, HTTPResponse } from "@/protocols/models/http";

export class SignInController implements Controller {
  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const requiredParams = ['username', 'password']

      const { username, password } = request.body

      for (let param of requiredParams) {
        if (!request.body[param]) {
          return httpResponse(400, `Empty param: ${param} is required`)
        }
      }

    return Promise.resolve(httpResponse(200, 'success'))
  }
}
