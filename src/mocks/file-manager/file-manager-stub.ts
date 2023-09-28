import { FileManager } from '@/protocols/use-cases/file'

export class FileManagerStub implements FileManager {
  async uploadImage(): Promise<string | null> {
    return '/uploads/any-file-uploaded.png'
  }

  async removeImage(): Promise<boolean> {
    return Promise.resolve(true)
  }
}
