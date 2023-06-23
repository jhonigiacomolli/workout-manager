export type EncryptOptions = {
  expire?: number
  issuer?: string
}

export type EncryptReturnStatus = {
  success: boolean,
  message: string
}

export interface Encrypter {
  encrypt: (id: string, options?: EncryptOptions) => Promise<string>
  decrypt: (hash: string) => Promise<{ data: any, status: EncryptReturnStatus }>
}
