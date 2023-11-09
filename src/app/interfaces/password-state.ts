import { InputStatus } from "../enums/input-status";
import { PasswordStrength } from "../enums/password-strength";

export interface PasswordState{
  status: InputStatus;
  strengthStatus?: PasswordStrength
}
