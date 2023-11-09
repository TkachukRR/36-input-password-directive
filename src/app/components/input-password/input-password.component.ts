import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { PasswordState } from "../../interfaces/password-state";
import { InputStatus } from "../../enums/input-status";
import { PasswordStrength } from "../../enums/password-strength";

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
    const letters = /^[а-яА-Яa-zA-Z]+$/;
    const digits = /^\d+$/;
    const symbols =  /^[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/;
    const lettersAndSymbols = /^(?=.*[а-яА-Яa-zA-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[а-яА-Яa-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/;
    const digitsAndLetters = /^(?=.*[а-яА-Яa-zA-Z])(?=.*\d)[а-яА-Яa-zA-Z\d]+$/;
    const symbolsAndDigits =/^(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/;
    const lettersAndDigitsAndSymbols =/^(?=.*[а-яА-Яa-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[а-яА-Яa-zA-Z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/;

    const onlyLetters = letters.test(password);
    const onlyDigits = digits.test(password);
    const onlySymbols = symbols.test(password)    ;
    const onlyLettersAndSymbols = lettersAndSymbols.test(password);
    const onlyDigitsAndLetters = digitsAndLetters.test(password);
    const onlySymbolsAndDigits = symbolsAndDigits.test(password);
    const onlyLettersAndDigitsAndSymbols = lettersAndDigitsAndSymbols.test(password);

    if (onlyLetters || onlyDigits || onlySymbols) this.passwordState.strengthStatus = PasswordStrength.easy
    if (onlyLettersAndSymbols || onlyDigitsAndLetters || onlySymbolsAndDigits) this.passwordState.strengthStatus = PasswordStrength.medium
    if (onlyLettersAndDigitsAndSymbols) this.passwordState.strengthStatus = PasswordStrength.strong
  }
}
