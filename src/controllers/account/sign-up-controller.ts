import { httpError, httpResponse } from "@/helpers/http";
import { Account } from "@/protocols/use-cases/account";
import { Controller } from "@/protocols/models/controller";
import { HTTPRequest, HTTPResponse } from "@/protocols/models/http";
import { Hasher } from "@/protocols/use-cases/cryptography/hashser";
import { Encrypter } from "@/protocols/use-cases/cryptography/encrypter";
import { EmailValidator } from "@/protocols/models/validator/email-validator";

type ConstructorProps = {
  emailValidator: EmailValidator
  account: Account
  hasher: Hasher
  encrypter: Encrypter
}

export class SignUpController implements Controller {
  constructor(private readonly dependencies: ConstructorProps) {
  }
  async handle(request: HTTPRequest): Promise<HTTPResponse> {
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

      if (!isValid) return (httpError(400, `Invalid param: email`))

      const emailInUse = await this.dependencies.account.checkEmailInUse(email)

      if (emailInUse) return (httpError(403, `E-mail already in use`))

      const hashedPassword = await this.dependencies.hasher.generate(password)

      const { id } = await this.dependencies.account.create({
        ...request.body,
        password: hashedPassword,
      })

      const accessToken = await this.dependencies.encrypter.encrypt(id)

      if (!accessToken) throw new Error()

      const { id: updatedId } = await this.dependencies.account.update({
        ...request.body,
        accessToken,
      })

      if (!updatedId) throw new Error()

      return httpResponse(200, { accessToken })
    } catch {
      return httpError(500, 'Internal Server Error')
    }
  }
}
