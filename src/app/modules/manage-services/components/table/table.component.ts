import { HttpHandlerService } from './../../../../core/services/http-handler.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Service } from 'src/app/core/models/service';
import { ServicesStatus } from 'src/app/core/models/services-status';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { Permissions } from 'src/app/core/services/permissions';
import { TranslateService } from '@ngx-translate/core';
import { ModelService } from '../../../../shared/components/model/model.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})

export class TableComponent implements OnInit {
  @Input() services: Service[] = [];
  @Input() totalItems: number = 0;
  @Input() paginationModle: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  @Output() pagination: EventEmitter<any> = new EventEmitter();

  language: string = this.translate.currentLang;
  servicesStatusEnum = ServicesStatus;
  loading: boolean = false;
  permissionsManageServiceEnum = Permissions.ServiceDesk.manageService;
  editLabel = this.translate.instant('shared.edit');
  options = [
    {
      item: this.editLabel,
      disabled: false,
      textColor: '',
      icon: 'bx bxs-edit',
    }
  ];

  constructor(
    private httpHandlerService: HttpHandlerService,
    private translate: TranslateService,
    private modelService: ModelService,
  ) {}

  ngOnInit(): void {
    this.handleLangChange();
  }

  handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.language = language.lang;
      this.editLabel = this.translate.instant('shared.edit');
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

  toggleActive(service) {
    this.loading = true;
    const query = {
      serviceId: service.serviceId,
      isPublished: !service.published,
    };
    this.modelService.close();
    this.httpHandlerService
      .post(Config.Service.toggleActivate, null, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        service.published = !service.published;
      });
  }

  msgText(service) {
    if (service.published) {
      return `${this.translate.instant('manageServices.areYouSureYouWantToUnpublish')} ${this.language === 'en'? service.title : service.titleAr}`;
    }
    return `${this.translate.instant('manageServices.areYouSureYouWantToPublish')} ${this.language === 'en'? service.title : service.titleAr}`;
  }

  openModel(service) {
    if (!service?.fixed){
      this.modelService.open('confrontation-msg' + service.serviceId);
    }
  }

  openPopup(service) {
    service.edit = true;
    this.modelService.open('new-service' + service.serviceId);
  }

  closeServiceModel(service) {
    service.edit = false;
    this.modelService.close();
  }

  update(event) {
    let index = this.services.findIndex(
      (service) => service.serviceId == event.serviceId
    );
    this.services[index] = event;
  }

  onOptionSelect(e, service) {
    if (e === this.editLabel) {
      this.openPopup(service);
    }
  }
}
