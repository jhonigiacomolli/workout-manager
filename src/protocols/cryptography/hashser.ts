export interface Hasher {
  generate(password: string): Promise<string>
}

