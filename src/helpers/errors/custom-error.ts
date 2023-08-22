export class CustomError extends Error {
  constructor(
    readonly statusCode,
    readonly message,
  ) {
    super(message)
    this.statusCode = statusCode
  }
}
