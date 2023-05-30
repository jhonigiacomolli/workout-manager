export interface Cryptography {
  encrypt(email: string, passoword: string): Promise<string>
}
