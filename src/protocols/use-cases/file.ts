import { File } from '@/protocols/models/file'

export interface FileUploader {
  uploadImage: (image: File) => Promise<string | null>
}
