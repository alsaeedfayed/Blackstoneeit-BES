import { TranslateService } from '@ngx-translate/core';
import { Directive, OnDestroy } from '@angular/core';
import { TranslateConfigService } from '../services/translate-config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive()
export class ComponentBase implements OnDestroy {
  destroy$: Subject<unknown> = new Subject();
  constructor(
    protected translateService: TranslateConfigService,
    protected translate: TranslateService
  ) {
    this.initTranslate();
  }

  initTranslate() {
    this.translateService.langChangeObserver
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.translate.use(lang);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
