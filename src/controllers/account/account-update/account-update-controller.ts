import { CreateAccountParams, type Account } from '@/protocols/use-cases/account'
import { type Controller } from '@/protocols/models/controller'
import { type HTTPRequest, type HTTPResponse } from '@/protocols/models/http'

import { httpResponse } from '@/helpers/http'
import { Team } from '@/protocols/use-cases/team'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'
import { FileUploader } from '@/protocols/use-cases/file'

interface ConstructorProps {
  account: Account
  team: Team
  fileUploader: FileUploader
}

export class AccountUdateController implements Controller {
  constructor(private readonly dependencies: ConstructorProps) {
  }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id

    if (!id) throw new EmptyParamError('id')

    const requiredParams = ['name', 'email']
    const updatedParams: Partial<CreateAccountParams> = {}

    for (const param of requiredParams) {
      if (!request.body[param]) throw new EmptyParamError(`${param}`)

      updatedParams[param] = request.body[param]
    }

    if (request.body.teamId) {
      const team = await this.dependencies.team.getTeamByID(request.body.teamId)

      if (!team) throw new InvalidParamError('teamId')
    } else {
      request.body.teamId = undefined
    }

    if (request.files.image) {
      request.body.image = await this.dependencies.fileUploader.uploadImage(request.files.image)
    }

    const updatedAccount = await this.dependencies.account.setUserById(id, request.body)

    if (!updatedAccount) throw new BadRequestError('Account update fails')

    const updatedAccountWithImageUrl = {
      ...updatedAccount,
      image: request.baseUrl + updatedAccount.image,
    }

    return httpResponse(200, {
      message: 'User updated successffuly',
      data: updatedAccountWithImageUrl,
    })
  }
}
