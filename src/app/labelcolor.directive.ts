import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appChangeLabelColorOnFocus]',
})
export class ChangeLabelColorOnFocusDirective {
  constructor(private el: ElementRef) {}

  @HostListener('focus') onFocus() {
    this.setLabelColor('text-gray-950');
  }

  @HostListener('blur') onBlur() {
    this.setLabelColor('text-gray-100');
  }

  private setLabelColor(colorClass: string) {
    this.el.nativeElement.classList.remove('text-gray-100', 'text-gray-950');
    this.el.nativeElement.classList.add(colorClass);
  }
}
