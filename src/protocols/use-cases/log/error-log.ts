type Input = {
  statusCode: number,
  date: string,
  message: string
  stack: string
}

export interface ErrorLog {
  save: (input: Input) => Promise<void>
}
