import { type Account } from '@/protocols/use-cases/account'
import { type Controller } from '@/protocols/models/controller'
import { type Hasher } from '@/protocols/use-cases/cryptography/hashser'
import { type HTTPRequest, type HTTPResponse } from '@/protocols/models/http'
import { type EmailValidator } from '@/protocols/models/validator/email-validator'

import { httpResponse } from '@/helpers/http'
import { BadRequestError, ForbiddenError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

interface ConstructorProps {
  emailValidator: EmailValidator
  account: Account
  hasher: Hasher
}

export class SignUpController implements Controller {
  constructor(private readonly dependencies: ConstructorProps) {
  }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const requiredParams = ['name', 'email', 'password', 'passwordConfirmation']

    const { email, password, passwordConfirmation } = request.body

    for (const param of requiredParams) {
      if (!request.body[param]) throw new EmptyParamError(param)
    }

    if (password !== passwordConfirmation) throw new BadRequestError('password and passwordConfirmation must be equal')

    const isValid = this.dependencies.emailValidator.validate(email)

    if (!isValid) throw new InvalidParamError('email')

    const emailInUse = await this.dependencies.account.checkEmailInUse(email)

    if (emailInUse) throw new ForbiddenError('E-mail already in use')

    const hashedPassword = await this.dependencies.hasher.generate(password)

    const result = await this.dependencies.account.create({
      ...request.body,
      password: hashedPassword,
    })

    return httpResponse(200, {
      message: 'Successfully registered user',
      data: result || {},
    })
  }
}
