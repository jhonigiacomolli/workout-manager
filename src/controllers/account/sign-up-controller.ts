import { httpError, httpReponse } from "@/helpers/http";
import { Controller } from "@/protocols/models/controller";
import { HTTPRequest, HTTPResponse } from "@/protocols/models/http";

export class SignUpController implements Controller {
  handle(request: HTTPRequest): HTTPResponse {
    const requiredParams = ['email', 'password', 'passwordConfirmation']

    const { password, passwordConfirmation } = request.body

    for (let param of requiredParams) {
      if (!request.body[param]) {
        return httpError(400, `Invalid param: ${param}`)
      }
    }

    if (password !== passwordConfirmation) {
      return (httpError(400, `Invalid param: password`))
    }

    return httpReponse(200, request)
  }
}
