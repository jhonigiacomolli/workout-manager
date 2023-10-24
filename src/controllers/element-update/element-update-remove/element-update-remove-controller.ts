import { httpResponse } from '@/helpers/http'
import { FileManager } from '@/protocols/use-cases/file'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { ElementUpdate } from '@/protocols/use-cases/element-update'
import { BadRequestError, EmptyParamError, NotFoundError } from '@/helpers/errors'

type Dependencies = {
  repository: ElementUpdate
  fileManager: FileManager
}

export class ElementUpdateRemoveController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }
  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id

    if (!id) throw new EmptyParamError('id')

    const elementUpdate = await this.dependencies.repository.getById(id)

    if (!elementUpdate?.id) throw new NotFoundError('Element update not found!')

    if (elementUpdate.attachments.length) {
      for (const imagePath of elementUpdate.attachments) {
        await this.dependencies.fileManager.removeImage(imagePath)
      }
    }

    const isRemoved = await this.dependencies.repository.delete(id)

    if (!isRemoved) throw new BadRequestError('Element update remove fails!')

    return httpResponse(204, 'Element update removed!')
  }
}
