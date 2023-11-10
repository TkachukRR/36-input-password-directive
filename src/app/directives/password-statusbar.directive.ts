import {
  Directive,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

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
    this.viewContainer.createEmbeddedView(this.templateRef)
    const inputPassword: HTMLInputElement = this.renderer.selectRootElement('input[type="password"]', this.elementRef.nativeElement)

    this.renderer.listen(inputPassword,'input', (event) => {
      const value = (event.target as HTMLInputElement).value;
      console.log('value:', value);
    });
    const inputPasswordWrapper = inputPassword.parentElement
    this.renderer.setStyle(inputPasswordWrapper, 'display','inline-block')

    const statusbar: HTMLDivElement = this.createStatusbar()
    this.renderer.appendChild(inputPassword.parentNode, statusbar)
  }

  createStatusbar(): HTMLDivElement {
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
}
