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
    try {
      const refrehToken = request.body.refreshToken

      if (!refrehToken) {
        return httpResponse(403, 'Empty param: refreshToken is required')
      }

      const { data, status } = await this.dependencies.encrypter.decrypt(refrehToken)

      if (!status.success) {
        return httpResponse(403, status.message)
      }

      if (!data || !data.id) {
        return httpResponse(403, 'Invalid param: refreshToken')
      }

      const accessToken = await this.dependencies.encrypter.encrypt(data, { expire: 3600, issuer: request.headers.host })
      const refreshToken = await this.dependencies.encrypter.encrypt(data, { expire: 86400, issuer: request.headers.host })

      return httpResponse(200, {
        accessToken,
        refreshToken,
      })
    } catch {
      return httpResponse(500, 'Internal Server Error')
    }
  }
}
