import { httpError, httpReponse } from "@/helpers/http";
import { Controller } from "@/protocols/models/controller";
import { HTTPRequest, HTTPResponse } from "@/protocols/models/http";
import { EmailValidator } from "@/protocols/models/validator/email-validator";

type ConstructorProps = {
  emailValidator: EmailValidator
}
export class SignUpController implements Controller {
  constructor(private readonly dependencies: ConstructorProps) {
  }
  handle(request: HTTPRequest): HTTPResponse {
    try {
      const requiredParams = ['email', 'password', 'passwordConfirmation']

      const { email, password, passwordConfirmation } = request.body

      for (let param of requiredParams) {
        if (!request.body[param]) {
          return httpError(400, `Invalid param: ${param}`)
        }
      }

      if (password !== passwordConfirmation) {
        return (httpError(400, `Invalid param: password`))
      }

      const isValid = this.dependencies.emailValidator.validate(email)

      if (!isValid) {
        return (httpError(400, `Invalid param: email`))
      }
      return httpReponse(200, request)
    } catch {
      return httpError(500, 'Internal Server Error')
    }
  }
}
