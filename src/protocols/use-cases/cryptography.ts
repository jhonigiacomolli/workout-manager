export interface Cryptography {
  encrypt(email: string, passoword: string): Promise<string>
  hash(password: string): Promise<string>
}
