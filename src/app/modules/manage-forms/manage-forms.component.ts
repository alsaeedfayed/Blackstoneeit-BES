import { NgxPermissionsService } from 'src/app/core/modules/permissions';
import { NgxPermission } from './../../core/modules/permissions/model/permission.model';
import { Config } from 'src/app/core/config/api.config';
import { Component, OnInit } from '@angular/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { finalize } from 'rxjs/operators';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { IForm } from './components/table/iForm.interface';
import { Permissions } from 'src/app/core/services/permissions';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-forms',
  templateUrl: './manage-forms.component.html',
  styleUrls: ['./manage-forms.component.scss'],
})
export class ManageFormsComponent extends ComponentBase implements OnInit {
  loading: boolean = false;
  forms: IForm[] = [];
  totalItems: number = 0;
  isShowForm: boolean = false;
  paginationModle: any = {
    pageIndex: 1,
    pageSize: 10000,
  };
  isShowCreateButton: boolean = !!this.permissionsService.getPermission(
    Permissions.ServiceDesk.manageForms.create
  );
  constructor(
    private modelService: ModelService,
    private httpHandlerService: HttpHandlerService,
    private permissionsService: NgxPermissionsService,
    translateService: TranslateConfigService,
    translate: TranslateService,
    private router: Router) {
      super(translateService, translate);
    }

  ngOnInit(): void {
    this.getFormsData();
  }

  getFormsData() {
    this.loading = true;
    const query = {
      ...this.paginationModle,
    };
    this.httpHandlerService
      .get(Config.FormBuilder.GetAll, query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.forms = res.data;
        this.totalItems = res.count;
      });
  }

  openPopup() {
    this.isShowForm = true;
    this.modelService.open('new-form');
  }

  toFormBuilder() {
    this.router.navigate(['/entity-designer']);
  }
}
