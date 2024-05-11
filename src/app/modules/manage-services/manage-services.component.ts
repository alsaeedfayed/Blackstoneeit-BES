import { Config } from 'src/app/core/config/api.config';
import { Component, OnInit } from '@angular/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { finalize } from 'rxjs/operators';
import { Service } from 'src/app/core/models/service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { NgxPermissionsService } from 'src/app/core/modules/permissions';
import { Permissions } from 'src/app/core/services/permissions';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-services',
  templateUrl: './manage-services.component.html',
  styleUrls: ['./manage-services.component.scss'],
})
export class ManageServicesComponent extends ComponentBase implements OnInit {

  loading: boolean = false;

  searchValue: string = '';
  categoryId: number;
  services: Service[] = [];

  totalItems: number = 0;
  paginationModle: any = {
    pageIndex: 1,
    pageSize: 30,
  };

  isShowCreateButton: boolean = !!this.permissionsService.getPermission(
    Permissions.ServiceDesk.manageService.create
  );
  isShowForm: boolean = false;
  
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private modelService: ModelService,
    private httpHandlerService: HttpHandlerService,
    private permissionsService: NgxPermissionsService,
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    this.getServicesData();
  }

  handleCategoryFilter(categoryId: number): any {
    this.categoryId = categoryId;
    this.paginationModle.pageIndex = 1;

    this.getServicesData();
  }

  handleSearchValueFilter(searchValue: string): any {
    this.searchValue = searchValue.toLowerCase();
    this.paginationModle.pageIndex = 1;

    this.getServicesData();
  }

  onPaginate(e) {
    this.paginationModle.pageIndex = e;

    this.getServicesData();
  }

  getServicesData() {
    this.loading = true;

    const query = {
      keyword: this.searchValue,
      cateogryId: this.categoryId,
      ...this.paginationModle,
    };

    this.httpHandlerService
      .get(Config.Service.getAllService, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.totalItems = res.count;
        this.services = res.data;

        this.services.map((service) => {
          this.httpHandlerService
            .post(Config.WorkflowEngine.getProcessesByIds, {
              ids: [service.processId],
            })
            .subscribe((res) => {
              res.map((obj) => {
                service.processName = obj.title;
                service.processNameAr = obj.arabicTitle;
              });
            });
        });
      });
  }

  openServicePopup() {
    this.isShowForm = true;
    this.modelService.open('new-service');
  }

  closeServiceModel() {
    this.isShowForm = false;
    this.modelService.close();
  }
}
