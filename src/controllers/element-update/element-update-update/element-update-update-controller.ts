import { httpResponse } from '@/helpers/http'
import { FileManager } from '@/protocols/use-cases/file'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'
import { ElementUpdate } from '@/protocols/use-cases/element-update'
import { paramValidation } from '@/helpers/validation/param-validation'
import { CreateElementUpdateModel } from '@/protocols/models/element-update'
import { BadRequestError, EmptyParamError, InvalidParamError, NotFoundError } from '@/helpers/errors'

type Dependencies = {
  repository: ElementUpdate
  fileManager: FileManager
}

export class ElementUpdateUpdateController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    const id = request.params.id
    const updatedElementUpdateParams: Partial<CreateElementUpdateModel> = {}
    const elementUpdateTypes = {
      content: 'string',
      elementId: 'string',
      user: 'string',
      attachments: 'array',
    }

    if (!id) throw new EmptyParamError('id')

    const savedElementUpdate = await this.dependencies.repository.getById(id)

    if (!savedElementUpdate?.id) throw new NotFoundError('Element update not found!')

    for (const bodyParamKey of Object.keys(request.body)) {
      if (bodyParamKey === 'elementId') continue

      const bodyParamValue = request.body[bodyParamKey]

      if (bodyParamValue) {
        const bodyParamType = elementUpdateTypes[bodyParamKey]
        const isValidParamType = paramValidation(bodyParamValue, bodyParamType)

        if (!isValidParamType) throw new InvalidParamError(`${bodyParamKey}, must have to be a ${bodyParamType}`)

        if (bodyParamKey === 'attachments') {
          updatedElementUpdateParams[bodyParamKey] = bodyParamValue.map(attachment => attachment.replace(request.baseUrl, ''))
        } else {
          updatedElementUpdateParams[bodyParamKey] = bodyParamValue
        }
      }
    }

    const bodyAttachments: string[] = request.body.attachments
    if (bodyAttachments) {
      for (const savedAttachment of savedElementUpdate.attachments) {
        if (!bodyAttachments.includes(request.baseUrl + savedAttachment)) {
          const savedAttachmentPath = savedAttachment.replace(request.baseUrl, '')
          await this.dependencies.fileManager.removeImage(savedAttachmentPath)
        }
      }
    }

    const attachmentsFiles = request.files.attachments
    if (attachmentsFiles && Array.isArray(attachmentsFiles)) {
      for (const attachmentFile of attachmentsFiles) {
        const uploadedImagePath = await this.dependencies.fileManager.uploadImage(attachmentFile)

        if (!uploadedImagePath) throw new BadRequestError('Upload attachment fails!')

        updatedElementUpdateParams.attachments = [
          ...(updatedElementUpdateParams.attachments || []),
          uploadedImagePath,
        ]
      }
    }

    const updatedElementUpdate = await this.dependencies.repository.setById(id, updatedElementUpdateParams)

    if (!updatedElementUpdate) throw new BadRequestError('Element update fails!')

    return httpResponse(200, {
      message: 'Element update succeeds!',
      data: {
        ...updatedElementUpdate,
        attachments: updatedElementUpdate.attachments.map(attach => request.baseUrl + attach),
      },
    })
  }
}
