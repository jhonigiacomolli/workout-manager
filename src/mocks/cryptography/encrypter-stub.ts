import { Encrypter } from '@/protocols/use-cases/cryptography/encrypter'

export class EncrypterStub implements Encrypter {
  async encrypt(): Promise<string> {
    return await Promise.resolve('encrypted_token')
  }

  async decrypt(): Promise<{ id: string }> {
    return await Promise.resolve({ id: 'decrupted_id' })
  }
}
