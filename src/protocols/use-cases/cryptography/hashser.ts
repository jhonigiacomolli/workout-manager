export interface Hasher {
  generate: (password: string) => Promise<string>
  compare: (password: string, hash: string) => Promise<boolean>
}
