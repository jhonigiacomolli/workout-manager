export type EncryptOptions = {
  expire?: number
  issuer?: string
}

export interface Encrypter {
  encrypt: (id: string, options?: EncryptOptions) => Promise<string>
  decrypt: <Type>(hash: string) => Promise<Type>
}
