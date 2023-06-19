export interface Encrypter {
  encrypt: (id: string) => Promise<string>
  decrypt: (hash: string) => Promise<{ id: string }>
}
