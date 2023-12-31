import { Directive, ElementRef, inject, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { InputStatus } from "../enums/input-status";
import { PasswordStrength } from "../enums/password-strength";
import { PasswordPatterns } from "../components/input-password/password-patterns";

@Directive({
  selector: '[appPasswordStatusbar]',
  standalone: true
})
export class PasswordStatusbarDirective implements OnInit{
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2)

  ngOnInit(): void {
    this.wrapElement()
    this.viewContainer.createEmbeddedView(this.templateRef)
    const inputPassword: HTMLInputElement = this.renderer.selectRootElement('input[type="password"]', this.elementRef.nativeElement)

    this.renderer.listen(inputPassword,'input', (event) => {
      const value = (event.target as HTMLInputElement).value;
      const inputStatus: InputStatus | PasswordStrength = this.getInputValueStatus(value);
      this.handlePasswordStatus(inputStatus)
    });

    const statusbar: HTMLDivElement = this.createStatusbar()
    this.renderer.appendChild(inputPassword.parentNode, statusbar)
  }


  private wrapElement() {
    const wrapper = this.renderer.createElement('span');
    const element = this.elementRef.nativeElement;
    const parent = this.renderer.parentNode(element);
    this.renderer.setStyle(wrapper, 'display','inline-block')
    parent.insertBefore(wrapper, element);
    parent.removeChild(element);
    this.renderer.appendChild(wrapper, element);
  }

  private createStatusbar(): HTMLDivElement {
    const divBar: HTMLDivElement = this.renderer.createElement('div')

    const firstInsideBlock = this.renderer.createElement('div')
    const secondInsideBlock = this.renderer.createElement('div')
    const thirdFirstInsideBlock = this.renderer.createElement('div')

    this.renderer.addClass(divBar, 'statusbar')
    this.renderer.addClass(firstInsideBlock, 'statusbar__item')
    this.renderer.addClass(secondInsideBlock, 'statusbar__item')
    this.renderer.addClass(thirdFirstInsideBlock, 'statusbar__item')

    this.renderer.appendChild(divBar, firstInsideBlock);
    this.renderer.appendChild(divBar, secondInsideBlock);
    this.renderer.appendChild(divBar, thirdFirstInsideBlock);
    return divBar
  }

  private getInputValueStatus(password: string): InputStatus | PasswordStrength {
    switch (true) {
      case password.length === 0:
        return InputStatus.empty;
      case password.length < 8:
        return InputStatus.short;
      default:
        return this.getPasswordStrengthType(password);
    }
  }

  private getPasswordStrengthType(password: string): PasswordStrength {
    const onlyLetters = PasswordPatterns['letters'].test(password);
    const onlyDigits = PasswordPatterns['digits'].test(password);
    const onlySymbols = PasswordPatterns['symbols'].test(password)    ;
    const onlyLettersAndSymbols = PasswordPatterns['lettersAndSymbols'].test(password);
    const onlyDigitsAndLetters = PasswordPatterns['digitsAndLetters'].test(password);
    const onlySymbolsAndDigits = PasswordPatterns['symbolsAndDigits'].test(password);
    const onlyLettersAndDigitsAndSymbols = PasswordPatterns['lettersAndDigitsAndSymbols'].test(password);

    if (onlyLetters || onlyDigits || onlySymbols) return PasswordStrength.easy;
    if (onlyLettersAndSymbols || onlyDigitsAndLetters || onlySymbolsAndDigits) return PasswordStrength.medium;
    if (onlyLettersAndDigitsAndSymbols) return PasswordStrength.strong;

    return PasswordStrength.unregistered;
  }

  private handlePasswordStatus(status: PasswordStrength | InputStatus){
    const parentSpan: HTMLSpanElement = this.elementRef.nativeElement.parentElement
    const statusBarItems: NodeListOf<Element> = parentSpan.querySelectorAll('.statusbar__item')
    const firstItem: Element = statusBarItems[0]
    const secondItem: Element = statusBarItems[1]

    statusBarItems.forEach(item => this.removeItemClasses(item))

    switch (status) {
      case InputStatus.short:
        statusBarItems.forEach(item => this.renderer.addClass(item, 'statusbar__item--short'));
        break;
      case PasswordStrength.easy:
        this.renderer.addClass(firstItem, 'statusbar__item--easy');
        break;
      case PasswordStrength.medium:
        this.renderer.addClass(firstItem, 'statusbar__item--medium');
        this.renderer.addClass(secondItem, 'statusbar__item--medium');
        break;
      case PasswordStrength.strong:
        statusBarItems.forEach(item => this.renderer.addClass(item, 'statusbar__item--strong'));
        break;
      default:
        break;
    }
  }

  private removeItemClasses(item: Element){
    this.renderer.removeClass(item, 'statusbar__item--short');
    this.renderer.removeClass(item, 'statusbar__item--easy');
    this.renderer.removeClass(item, 'statusbar__item--medium');
    this.renderer.removeClass(item, 'statusbar__item--strong');
  }
}
