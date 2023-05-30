import { EmailValidator } from "@/protocols/models/validator/email-validator";
import { validate } from 'email-validator'

export class EmailValidatorRepository implements EmailValidator {
  validate(email: string) {
    return validate(email)
  }
}
