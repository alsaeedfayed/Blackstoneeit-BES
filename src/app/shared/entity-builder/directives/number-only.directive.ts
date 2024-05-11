import { Directive, ElementRef, Renderer2, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[onlyNumber]',
})
export class OnlyNumberDirective {
  @Input() onlyNumber: boolean = true;
  constructor(private _elRef: ElementRef, private _renderer: Renderer2) { }

  @HostListener('paste', ['$event'])
  onPaste(event): any {

   // console.log(!!Number(event.clipboardData.getData('text')), !!this.onlyNumber)
    if (!Number(event.clipboardData.getData('text')) && !!this.onlyNumber) {
      return false;
    }

  }

  ngOnInit() {
    if (!this.onlyNumber) return;
    this._renderer.setAttribute(
      this._elRef.nativeElement,
      'onkeypress',
      'return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 0  || event.charCode == 46'
    );
  }
}
