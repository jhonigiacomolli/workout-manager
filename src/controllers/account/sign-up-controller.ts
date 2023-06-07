import { Account } from "@/protocols/use-cases/account"
import { httpError, httpResponse } from "@/helpers/http"
import { Controller } from "@/protocols/models/controller"
import { Hasher } from "@/protocols/use-cases/cryptography/hashser"
import { HTTPRequest, HTTPResponse } from "@/protocols/models/http"
import { EmailValidator } from "@/protocols/models/validator/email-validator"

type ConstructorProps = {
  emailValidator: EmailValidator
  account: Account
  hasher: Hasher
}

export class SignUpController implements Controller {
  constructor(private readonly dependencies: ConstructorProps) {
  }
  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    try {
      const requiredParams = ['name', 'email', 'password', 'passwordConfirmation']

      const { email, password, passwordConfirmation } = request.body

      for (let param of requiredParams) {
        if (!request.body[param]) {
          return httpResponse(400, `Empty param: ${param} is required`)
        }
      }

      if (password !== passwordConfirmation) {
        return httpResponse(400, `password and passwordConfirmation must be equal`)
      }

      const isValid = this.dependencies.emailValidator.validate(email)

      if (!isValid) return httpResponse(400, `Invalid param: email`)

      const emailInUse = await this.dependencies.account.checkEmailInUse(email)

      if (emailInUse) return (httpResponse(403, `E-mail already in use`))

      const hashedPassword = await this.dependencies.hasher.generate(password)

     await this.dependencies.account.create({
        ...request.body,
        password: hashedPassword,
      })

      return httpResponse(200, 'Successfully registered user')
    } catch {
      return httpError(500, 'Internal Server Error')
    }
  }
}
