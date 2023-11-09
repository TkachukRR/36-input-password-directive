import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { InputStatus } from "../enums/input-status";
import { PasswordPatterns } from "../components/input-password/password-patterns";
import { PasswordStrength } from "../enums/password-strength";

@Directive({
  selector: '[appPasswordState]',
  standalone: true
})
export class PasswordStateDirective {
  @HostListener('input') onInput() {
    this.checkPasswordState(this.el.nativeElement.value)
  }
  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  checkPasswordState(password: string){
    this.renderer.removeAttribute(this.el.nativeElement,'password-strength')

    switch (true) {
      case password.length === 0:
        this.renderer.setAttribute(this.el.nativeElement, 'password-state', InputStatus.empty);
        break;
      case password.length < 8:
        this.renderer.setAttribute(this.el.nativeElement, 'password-state', InputStatus.short);
        break;
      default:
        this.renderer.setAttribute(this.el.nativeElement, 'password-state', InputStatus.strength);
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

    if (onlyLetters || onlyDigits || onlySymbols) this.renderer.setAttribute(this.el.nativeElement, 'password-strength', PasswordStrength.easy);
    if (onlyLettersAndSymbols || onlyDigitsAndLetters || onlySymbolsAndDigits) this.renderer.setAttribute(this.el.nativeElement, 'password-strength', PasswordStrength.medium);
    if (onlyLettersAndDigitsAndSymbols) this.renderer.setAttribute(this.el.nativeElement, 'password-strength', PasswordStrength.strong);
  }
}
