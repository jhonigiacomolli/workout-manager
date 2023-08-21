import { EncryptReturnStatus, Encrypter } from '@/protocols/use-cases/cryptography/encrypter'

export class EncrypterStub implements Encrypter {
  async encrypt(): Promise<string> {
    return await Promise.resolve('encrypted_token')
  }

  async decrypt(): Promise<{ data: any, status: EncryptReturnStatus }> {
    return await Promise.resolve({
      data: { id: 'valid_id' },
      status: {
        success: true,
        message: '',
      },
    })
  }
}
