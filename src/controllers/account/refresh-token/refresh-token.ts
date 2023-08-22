import { ForbiddenError } from '@/helpers/errors'
import { httpResponse } from '@/helpers/http'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { Encrypter } from '@/protocols/use-cases/cryptography/encrypter'

type Dependencies = {
  encrypter: Encrypter
}

export class RefreshTokenController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const refrehToken = request.body.refreshToken

    if (!refrehToken) {
      throw new ForbiddenError('Empty param: refreshToken is required')
    }

    const host = request.headers.host || 'http://localhost'

    const { data, status } = await this.dependencies.encrypter.decrypt(refrehToken, host)

    if (!status.success) {
      throw new ForbiddenError(status.message)
    }

    if (!data || !data.id) {
      throw new ForbiddenError('Invalid param: refreshToken')
    }

    const accessToken = await this.dependencies.encrypter.encrypt(data, { expire: 3600, issuer: request.headers.host })
    const refreshToken = await this.dependencies.encrypter.encrypt(data, { expire: 86400, issuer: request.headers.host })

    return httpResponse(200, {
      accessToken,
      refreshToken,
    })
  }
}
