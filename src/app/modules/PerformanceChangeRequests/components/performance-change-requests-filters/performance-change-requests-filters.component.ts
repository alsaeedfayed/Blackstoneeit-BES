import { finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Config } from 'src/app/core/config/api.config';
import { StructureLookups } from 'src/app/utils/loockups.utils';
import { Lookup } from 'src/app/core/models/category';
import { ServicesStatus } from 'src/app/core/models/services-status';
import { forkJoin } from 'rxjs';
import { Service } from 'src/app/core/models/service';
@Component({
  selector: 'performance-change-requests-filters',
  templateUrl: './performance-change-requests-filters.component.html',
  styleUrls: ['./performance-change-requests-filters.component.scss'],
})
export class PerformanceChangeRequestsFiltersComponent implements OnInit {
  @Output() catgoryFilterEvent = new EventEmitter();
  @Output() servicesFilterEvent = new EventEmitter();
  @Output() statusesFilterEvent = new EventEmitter();
  @Output() ownedTasksFilterEvent = new EventEmitter();
  categories: Lookup[] = [];
  services: Service[] = [];
  language: string = this.translateService.currentLang;
  servicesStatusEnum = ServicesStatus;
  loading: boolean = false;
  constructor(
    private httpHandlerService: HttpHandlerService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getLookUps();
    this.handleLangChange();
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.language = language.lang;
    });
  }

  handleCatgoryFilter(catgoryId: number) {
    this.catgoryFilterEvent.emit(catgoryId);
  }
  handleServicesFilter(serviceId: number) {
    this.servicesFilterEvent.emit(serviceId);
  }

  handleStatusesFilter(status: number) {
    this.statusesFilterEvent.emit(status);
  }

  handleOwnedTasksFilterEvent(event) {
    this.ownedTasksFilterEvent.emit(event.target.checked);
  }

  //get lookups for dropdowns
  getLookUps() {
    this.loading = true;
    const queryServiceDesk = {
      ServiceName: 'ServiceDesk',
    };
    const categories = this.httpHandlerService.get(
      Config.Lookups.lookupService,
      queryServiceDesk
    );
    const services = this.httpHandlerService.get(Config.Service.getService);
    forkJoin({ categories, services })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.categories = StructureLookups(res.categories).Category;
        this.services = res.services;
      });
  }
}
