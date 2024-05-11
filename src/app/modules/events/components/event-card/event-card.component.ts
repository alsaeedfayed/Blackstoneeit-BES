import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  lang: string = this.translate.currentLang;

  @Input() data;

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
  ) {
    super(translateService, translate);
  }

  ngOnInit() {
  
    // handles language change event
    this.handleLangChange();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.lang = this.translate.currentLang;
      });
  }

}
