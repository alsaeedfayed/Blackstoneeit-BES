import { finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Component, OnInit, Output, EventEmitter, Input , OnChanges } from '@angular/core';
import { Config } from 'src/app/core/config/api.config';
import { StructureLookups } from 'src/app/utils/loockups.utils';
import { Lookup } from 'src/app/core/models/category';
import { ServicesStatus } from 'src/app/core/models/services-status';
import { forkJoin } from 'rxjs';
import { Service } from 'src/app/core/models/service';
@Component({
  selector: 'requests-filters',
  templateUrl: './requests-filters.component.html',
  styleUrls: ['./requests-filters.component.scss'],
})
export class RequestsFiltersComponent implements OnInit, OnChanges {

  @Output() catgoryFilterEvent = new EventEmitter();
  @Output() servicesFilterEvent = new EventEmitter();
  @Output() statusesFilterEvent = new EventEmitter();
  @Output() ownedTasksFilterEvent = new EventEmitter();
  @Output() onAssignedToMeFilter = new EventEmitter();
  @Input() filters = {
    assignedToMe : false,
    categoryId : null
  };
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

  ngOnChanges(){
    if(this.filters){
      this.filters.categoryId = parseInt(this.filters?.categoryId) != 0? parseInt(this.filters?.categoryId) : null;
    }
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.language = language.lang;
    });
  }

  handleCatgoryFilter(catgoryId: number) {
    this.catgoryFilterEvent.emit(catgoryId);
  }
  
  // handleServicesFilter(service: string) {
  //   this.servicesFilterEvent.emit(service);
  // }

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
    //const services = this.httpHandlerService.get(Config.Service.getService);
    // forkJoin({ categories, services })
    forkJoin({ categories })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.categories = StructureLookups(res.categories).Category;
        //this.services = res.services;
      });
  }

  onAssignedToMeChange(e) {
    this.onAssignedToMeFilter.emit(e);
  }
}
