import { File } from '@/protocols/models/file'

export interface FileManager {
  uploadImage: (image: File) => Promise<string | null>
  removeImage: (imagePath: string) => Promise<boolean>
}
