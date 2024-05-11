import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServicesStatus } from 'src/app/core/models/services-status';
import { NgxPermissionsService } from 'src/app/core/modules/permissions/service/permissions.service';
import { Permissions } from 'src/app/core/services/permissions';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "requests-table",
  templateUrl: "./requests-table.component.html",
  styleUrls: ["./requests-table.component.scss"],
})
export class RequestsTableComponent implements OnInit {
  @Input() Requests: any[] = [];
  @Input() totalItems: number;
  @Input() paginationModel: any = {
    pageIndex: 1,
    pageSize: 30,
  };
  @Output() onRating: EventEmitter<any> = new EventEmitter();
  @Output() onPaginate = new EventEmitter();
  lang: string;
  servicesStatusEnum = ServicesStatus;

  constructor(
    private permissionsService: NgxPermissionsService,
    private router: Router,
    private translate: TranslateService
  ) {}

  allowGoToDetails: boolean = !!this.permissionsService.getPermission(
    Permissions.ServiceDesk.myRequests.details
  );

  goToDetails(id: string) {
    this.router.navigateByUrl("/requests/request-details/" + id);
  }

  ngOnInit(): void {
    this.lang = this.translate.currentLang;
    this.handleLangChange();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe(language => {
      this.lang = language.lang;
    });
  }

  setRating(rating: number, request: any) {
    let obj = {
      rating: rating,
      request: request,
    };
    this.onRating.emit(obj);
  }

  onPageChange(e) {
    this.onPaginate.emit(e);
  }

  getLabel(currentStatus, label) {
    if (this.lang === "en") {
      return currentStatus?.en ? `${label} - ${currentStatus?.en}` : label;
    } else {
      label = label.toLowerCase();
      let text = this.translate.instant("shared." + label);
      return currentStatus?.ar ? `${text} - ${currentStatus?.ar}` : text;
    }
  }
}
