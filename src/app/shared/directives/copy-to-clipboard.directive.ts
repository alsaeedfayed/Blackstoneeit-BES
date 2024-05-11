import { Directive, Input, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Directive({
  selector: '[copyToClipboard]'
})
export class CopyToClipboardDirective {

  @Input('copyToClipboard') elementToCopy: HTMLElement;

  @HostListener('click') onClick() {
    if (this.elementToCopy) {
      const textToCopy = this.elementToCopy.textContent || '';
      this.copyToClipboard(textToCopy);
    }
  }

  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
  ) { }

  private copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
      .then(() => {
        this.toastr.success(this.translate.instant('shared.textCopiedToClipboard'));
      })
      .catch(error => {
        this.toastr.error(this.translate.instant('shared.errorCopyingToClipboard'));
      });
  }
}
