import { EmailValidator } from "@/protocols/models/validator/email-validator";

export class EmailValidatorController implements EmailValidator {
  validate(email: string) {
    return false;
  }
}
