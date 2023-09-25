import { FileUploader } from '@/protocols/use-cases/file'

export class FileUploaderStub implements FileUploader {
  async uploadImage(): Promise<string | null> {
    return 'http://localhost/uploads/any-file-uploaded.png'
  }
}
