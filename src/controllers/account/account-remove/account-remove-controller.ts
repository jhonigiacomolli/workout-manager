import { httpResponse } from '@/helpers/http'
import { Account } from '@/protocols/use-cases/account'
import { Controller } from '@/protocols/models/controller'
import { BadRequestError, EmptyParamError, InternalServerError } from '@/helpers/errors'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { FileManager } from '@/protocols/use-cases/file'

type AccountRemoveControllerProps = {
  account: Account
  fileManager: FileManager
}

export class AccountRemoveController implements Controller {
  constructor(private readonly dependencies: AccountRemoveControllerProps) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id

    if (!id) throw new EmptyParamError('id')

    const account = await this.dependencies.account.getUserById(id)

    if (account?.image) {
      const imageRemoved = await this.dependencies.fileManager.removeImage(account.image)

      if (!imageRemoved) throw new InternalServerError('Failed to remove image!')
    }

    const success = await this.dependencies.account.delete(id)

    if (!success) throw new BadRequestError('User removal failed')

    return httpResponse(204, 'User removed')
  }
}
