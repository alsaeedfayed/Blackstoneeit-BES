import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'work-groups-cards',
  templateUrl: './work-groups-cards.component.html',
  styleUrls: ['./work-groups-cards.component.scss']
})
export class WorkGroupsCardsComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  committeeId: number = 0;
  @Input() list = [];
  @Input() totalItems: number;
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  @Output() onPaginateEvent = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  statuses = [
    { id: 0, name: 'Inactive', nameAr: 'غير فعالة',className :'closed' },
    { id: 1, name: 'Active', nameAr: 'فعالة' ,className :'active' },
  ];
  ngOnInit(): void {
    //get committee id
    this.committeeId = +this.route.snapshot.parent.params['id'];
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

  // emit a pagination event to the parent component
  onPaginate(e) {
    this.onPaginateEvent.emit(e);
  }
}
