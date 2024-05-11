import { Component, OnInit, Input } from '@angular/core';
import { Tab } from './tab';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tabs-menu',
  templateUrl: './tabs-menu.component.html',
  styleUrls: ['./tabs-menu.component.scss']
})
export class TabsMenuComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  @Input() tabs: Tab[] = [];
  @Input() breakpoint: 'sm' | 'md' | 'lg' = 'md';

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
  
    // handles language change event
    this.handleLangChange();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

}
