import { FileUploader } from '@/protocols/use-cases/file'

export class FileUploaderStub implements FileUploader {
  async uploadImage(): Promise<string | null> {
    return '/uploads/any-file-uploaded.png'
  }
}
