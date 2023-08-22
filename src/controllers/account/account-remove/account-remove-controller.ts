import { httpResponse } from '@/helpers/http'
import { BadRequestError } from '@/helpers/errors'
import { Account } from '@/protocols/use-cases/account'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'

type AccountRemoveControllerProps = {
  account: Account
}

export class AccountRemoveController implements Controller {
  constructor(private readonly dependencies: AccountRemoveControllerProps) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id

    if (!id) {
      throw new BadRequestError('Empty param: id is required')
    }

    const success = await this.dependencies.account.delete(id)

    if (!success) {
      throw new BadRequestError('User removal failed')
    }

    return httpResponse(204, 'User removed')
  }
}
