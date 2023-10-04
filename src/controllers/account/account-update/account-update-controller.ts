import { type Controller } from '@/protocols/models/controller'
import { type HTTPRequest, type HTTPResponse } from '@/protocols/models/http'
import { type CreateAccountParams, type Account } from '@/protocols/use-cases/account'

import { httpResponse } from '@/helpers/http'
import { Team } from '@/protocols/use-cases/team'
import { FileManager } from '@/protocols/use-cases/file'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

interface ConstructorProps {
  account: Account
  team: Team
  fileManager: FileManager
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

    const oldAccount = await this.dependencies.account.getUserById(id)
    if (request.files.image) {
      if (oldAccount?.image) {
        this.dependencies.fileManager.removeImage(oldAccount.image)
      }
      request.body.image = await this.dependencies.fileManager.uploadImage(request.files.image)
    } else {
      if (typeof request.body.image === 'string') {
        if (request.body.image === '') {
          if (oldAccount?.image) {
            await this.dependencies.fileManager.removeImage(oldAccount.image)
          }
        } else {
          request.body.image = undefined
        }
      }
    }

    const updatedAccount = await this.dependencies.account.setUserById(id, request.body)

    if (!updatedAccount) throw new BadRequestError('Account update fails')

    const responseImage = updatedAccount.image ? request.baseUrl + updatedAccount.image : updatedAccount.image

    const updatedAccountWithImageUrl = {
      ...updatedAccount,
      image: responseImage,
    }

    return httpResponse(200, {
      message: 'User updated successffuly',
      data: updatedAccountWithImageUrl,
    })
  }
}
