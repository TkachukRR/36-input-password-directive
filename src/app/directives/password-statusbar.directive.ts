import {Directive, inject, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appPasswordStatusbar]',
  standalone: true
})
export class PasswordStatusbarDirective implements OnInit{
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);

  ngOnInit(): void {
    this.viewContainer.createEmbeddedView(this.templateRef)
  }
}
