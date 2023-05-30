import { EmailValidator } from "@/protocols/models/validator/email-validator";

export class EmailValidatorRepository implements EmailValidator {
  validate(email: string) {
    return false
  }
}
