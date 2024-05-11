import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'vote-progress',
  templateUrl: './vote-progress.component.html',
  styleUrls: ['./vote-progress.component.scss']
})
export class VoteProgressComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  @Input() users: any[];
  @Input() percent: number;
  @Input() color: string;

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
