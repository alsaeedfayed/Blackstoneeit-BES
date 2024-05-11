import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'committees-rows',
  templateUrl: './committees-rows.component.html',
  styleUrls: ['./committees-rows.component.scss']
})
export class CommitteesRowsComponent implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

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
    private modalService: ModelService,
  ) { }

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

  // emit a pagination event to the parent component
  onPaginate(e) {
    this.onPaginateEvent.emit(e);
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    const lastDate = new Date(date)
    const newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

  // open committee highlight modal
  openCommitteeHighlightModal(item) {
    item.isHighlighted = true;
    this.modalService.open("committee-highlight" + item.id);
  }

  // go to committee details page
  goToCommitteeDetails(id) {
    this.router.navigateByUrl(`committees-management/committee-details/${id}`);
  }
}
