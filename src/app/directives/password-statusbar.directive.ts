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
  }
}
