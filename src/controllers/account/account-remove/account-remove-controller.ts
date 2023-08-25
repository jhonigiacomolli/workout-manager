import { httpResponse } from '@/helpers/http'
import { Account } from '@/protocols/use-cases/account'
import { Controller } from '@/protocols/models/controller'
import { BadRequestError, EmptyParamError } from '@/helpers/errors'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'

type AccountRemoveControllerProps = {
  account: Account
}

export class AccountRemoveController implements Controller {
  constructor(private readonly dependencies: AccountRemoveControllerProps) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id

    if (!id) throw new EmptyParamError('id')

    const success = await this.dependencies.account.delete(id)

    if (!success) throw new BadRequestError('User removal failed')

    return httpResponse(204, 'User removed')
  }
}
