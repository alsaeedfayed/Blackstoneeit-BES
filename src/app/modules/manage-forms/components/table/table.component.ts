import { HttpHandlerService } from './../../../../core/services/http-handler.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Service } from 'src/app/core/models/service';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { Permissions } from 'src/app/core/services/permissions';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() forms: Service[] = [];
  @Input() totalItems: number = 0;
  @Input() paginationModle: any = {
    pageIndex: 1,
    pageSize: 30,
  };
  editLabel = this.translateService.instant('shared.edit');

  options = [
    {
      item: this.editLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bxs-edit',
    }
  ];
  @Output() pagination: EventEmitter<any> = new EventEmitter();

  destroy$: Subject<unknown> = new Subject();
  loading: boolean = false;
  permissionsManageFormsEnum =  Permissions.ServiceDesk.manageForms;
  public lang = this.translateService.currentLang;
  private endSub$ = new Subject()

  constructor(
    private httpHandlerService: HttpHandlerService,
    private translateService:TranslateService,
    private modalService: ModelService,
    private rotuer: Router
  ) {
  //  this.handleLangChange();
  }

  toggleActive(form) {
    this.loading = true;
    const query = {
      formId: form.id,
      isActive: !form.isActive,
    };
    this.modalService.close();
    this.httpHandlerService
      .post(Config.FormBuilder.ToggleActivate, null, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        form.isActive = !form.isActive;
      });
  }

  // Convert UTC Date To LocalDate
  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date)
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }

  ngOnInit(): void {
    this.handleLangChange();
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = this.translateService.currentLang;
      this.editLabel = this.translateService.instant('shared.edit');
      this.options = [
        {
          item: this.editLabel,
          disabled: false,
          textColor: '',
          icon: 'bx bxs-edit',
        }
      ];
    });
  }

  onOptionSelect(e, form) {
    if (e === this.editLabel) {
      this.rotuer.navigate(['/entity-designer'], {
        queryParams: {
          id: form.id
        }
      })
    }
  }
  msgText(form) {
    if (form.isActive) {
      return `${this.translateService.instant('manageForms.areYouSureYouWantToDeactivate')} ${form.name}`;
    }
    return `${this.translateService.instant('manageForms.areYouSureYouWantToActivate')} ${form.name}`;
  }

  openModel(form) {
    this.modalService.open('confrontation-msg' + form.id);
  }

  onPaginate(e) {
    this.paginationModle.pageIndex = e;
    this.pagination.emit(e);
  }
}
