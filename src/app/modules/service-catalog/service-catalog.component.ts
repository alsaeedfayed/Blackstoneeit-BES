import { UserService } from './../../core/services/user.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Lookup } from 'src/app/core/models/category';
import { Service } from 'src/app/core/models/service';
import { StructureLookups } from 'src/app/utils/loockups.utils';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-service-catalog',
  templateUrl: './service-catalog.component.html',
  styleUrls: ['./service-catalog.component.scss'],
})
export class ServiceCatalogComponent extends ComponentBase implements OnInit {
  lang: string;
  services: Service[] = [];
  loading: boolean = false;
  cateogryId: any = 0;
  categories: Lookup[] = [];
  isFavourite: boolean = false;
  serviceName: string = '';
  servicesFilter: Service[] = [];

  constructor(
    private httpHandlerService: HttpHandlerService,
    private userService: UserService,
    private modelService: ModelService,
    translateService: TranslateConfigService,
    translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private cdref: ChangeDetectorRef,
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(data => {
      this.serviceName = data.serviceName;
      this.cateogryId = data.cateogryId || 0;
      this.lang = this.translate.currentLang;
      this.handleLangChange();
      //this.getLookups();
      this.getCategories();
      this.getServises();

      if (this.cateogryId == 'favorite') {
        this.servicesFilter = this.services.filter(
          (service) => service.favourite
        );
        // this.getServises();
      } else if (this.cateogryId == 0) {
        this.servicesFilter = this.services;
      } else {
        this.servicesFilter = this.services;
        this.servicesFilter = this.services.filter(
          (service) => service.cateogryId == this.cateogryId
        );
      }
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  handleGetServises() {
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(), 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }

  getCategories() {
    this.httpHandlerService
    .get(Config.ServicesCatalogues.getCategories)
    .subscribe((res) => {
      this.categories = res;
    });
  }

  getLookups() {
    const query = {
      ServiceName: 'ServiceDesk',
    };
    this.httpHandlerService
      .get(Config.Lookups.lookupService, query)
      .subscribe((res) => {
        this.categories = StructureLookups(res).Category;
      });
  }

  getServises() {
    this.loading = true;
    const body = {
      pageIndex: 1,
      pageSize: 100000,
      cateogryId: this.cateogryId,
      favourite: this.isFavourite,
    };

    this.httpHandlerService
      .get(Config.ServicesCatalogues.getAllServicesCatalogues, body)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.services = res.data;
        this.servicesFilter = res.data;
      });
  }


  //add service to  favourite
  toggleFavouriteService(service: Service) {
    service.isFavouritLoading = true;
    const query = {
      serviceId: service.id,
      favourite: !service.favourite,
      employeeId: this.userService.getCurrentUserId(),
    };
    this.httpHandlerService
      .post(Config.ServicesCatalogues.toggleFavourite, query)
      .pipe(finalize(() => (service.isFavouritLoading = false)))
      .subscribe((res) => {
        service.favourite = !service.favourite;
      });
  }


  startService() {
    this.modelService.open('start-service');
  }

  getQueryParams(){
    return {
      serviceName : this.serviceName,
      cateogryId : this.cateogryId
    }
  }

  handleSearch(e){
    this.serviceName = e;
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: this.getQueryParams(), 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }
}
