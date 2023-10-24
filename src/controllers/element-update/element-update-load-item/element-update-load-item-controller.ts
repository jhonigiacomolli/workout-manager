import { httpResponse } from '@/helpers/http'
import { Controller } from '@/protocols/models/controller'
import { EmptyParamError, NotFoundError } from '@/helpers/errors'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { ElementUpdate } from '@/protocols/use-cases/element-update'

type Dependencies = {
  repository: ElementUpdate
}

export class ElementUpdateLoadItemController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id

    if (!id) throw new EmptyParamError('id')

    const elementUpdate = await this.dependencies.repository.getById(id)

    if (!elementUpdate) throw new NotFoundError('Element update not found!')

    return httpResponse(200, {
      ...elementUpdate,
      attachments: elementUpdate.attachments.map(attachment => request.baseUrl + attachment),
    })
  }
}
