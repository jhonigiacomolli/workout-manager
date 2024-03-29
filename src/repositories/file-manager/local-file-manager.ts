import { randomUUID } from 'crypto'
import { join, resolve } from 'path'
import { File } from '@/protocols/models/file'
import { FileManager } from '@/protocols/use-cases/file'
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs'

export class LocalFileManagerRepository implements FileManager {
  async uploadImage(image: File): Promise<string | null> {
    if (
      !image.filename ||
      !image.data ||
      !image.extension ||
      !image.data
    ) return null

    const acceptedMimes = [
      'image/png',
      'image/jpeg',
      'image/svg+xml',
      'image/webp',
    ]

    if (!acceptedMimes.includes(image.mime)) return null

    const uploadDirPath = resolve('public/uploads')
    const uploadDirExist = existsSync(uploadDirPath)

    if (!uploadDirExist) {
      mkdirSync(uploadDirPath)
    }

    const uploadedFileName = randomUUID()
    const uploadedFilePath = join(uploadDirPath, `${uploadedFileName}.${image.extension}`)

    const stream = createWriteStream(uploadedFilePath)
    stream.write(image.data, 'binary')
    stream.close()
    image.data = 'bin'

    return `/uploads/${uploadedFileName}.${image.extension}`
  }

  async removeImage(imagePath: string): Promise<boolean> {
    const imageFullPath = resolve('public' + imagePath)

    const fileExist = existsSync(imageFullPath)

    if (!fileExist) return Promise.resolve(false)

    unlinkSync(imageFullPath)

    return Promise.resolve(true)
  }
}
