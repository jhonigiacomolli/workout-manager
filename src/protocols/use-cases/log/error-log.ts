import { ErrorLogInput } from '@/protocols/models/log/error-log'

export interface ErrorLog {
  save: (input: ErrorLogInput) => Promise<void>
}
