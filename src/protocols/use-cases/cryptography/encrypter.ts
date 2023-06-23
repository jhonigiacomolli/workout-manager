export type EncryptOptions = {
  expire?: number
  issuer?: string
}

export type EncryptReturnStatus = {
  success: boolean,
  message: string
}

export interface Encrypter {
  encrypt: (data: any, options?: EncryptOptions) => Promise<string>
  decrypt: (hash: string, issuer: string) => Promise<{ data: any, status: EncryptReturnStatus }>
}
