import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { PasswordState } from "../../interfaces/password-state";
import { InputStatus } from "../../enums/input-status";
import { PasswordStrength } from "../../enums/password-strength";
import { PasswordPatterns } from "./password-patterns";

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-password.component.html',
  styleUrl: './input-password.component.scss'
})
export class InputPasswordComponent implements OnDestroy{
  inputPassword: FormControl = new FormControl('')
  passwordState: PasswordState = { status: InputStatus.empty }

  valueSub = this.inputPassword.valueChanges.subscribe(val => this.checkPasswordState(val))

  ngOnDestroy() {
    this.valueSub.unsubscribe()
  }

  checkPasswordState(password: string){
    if (this.passwordState.strengthStatus) delete this.passwordState.strengthStatus

    switch (true) {
      case password.length === 0:
        this.passwordState.status = InputStatus.empty;
        break;
      case password.length < 8:
        this.passwordState.status = InputStatus.short;
        break;
      default:
        this.passwordState.status = InputStatus.strength;
        this.setStrengthType(password)
        break;
    }
  }

  setStrengthType(password: string){
    const onlyLetters = PasswordPatterns['letters'].test(password);
    const onlyDigits = PasswordPatterns['digits'].test(password);
    const onlySymbols = PasswordPatterns['symbols'].test(password)    ;
    const onlyLettersAndSymbols = PasswordPatterns['lettersAndSymbols'].test(password);
    const onlyDigitsAndLetters = PasswordPatterns['digitsAndLetters'].test(password);
    const onlySymbolsAndDigits = PasswordPatterns['symbolsAndDigits'].test(password);
    const onlyLettersAndDigitsAndSymbols = PasswordPatterns['lettersAndDigitsAndSymbols'].test(password);

    if (onlyLetters || onlyDigits || onlySymbols) this.passwordState.strengthStatus = PasswordStrength.easy
    if (onlyLettersAndSymbols || onlyDigitsAndLetters || onlySymbolsAndDigits) this.passwordState.strengthStatus = PasswordStrength.medium
    if (onlyLettersAndDigitsAndSymbols) this.passwordState.strengthStatus = PasswordStrength.strong
  }
}
