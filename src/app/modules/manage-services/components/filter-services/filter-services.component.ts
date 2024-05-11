import { HttpHandlerService } from './../../../../core/services/http-handler.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Config } from 'src/app/core/config/api.config';
import { finalize } from 'rxjs/operators';
import { StructureLookups } from 'src/app/utils/loockups.utils';
import { Lookup } from 'src/app/core/models/category';
import { ServicesStatus } from 'src/app/core/models/services-status';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-filter-services',
  templateUrl: './filter-services.component.html',
  styleUrls: ['./filter-services.component.scss'],
})
export class FilterServicesComponent implements OnInit {
  @Output() categoryFilterEvent = new EventEmitter();
  @Output() statusesFilterEvent = new EventEmitter();

  language: string = this.translateService.currentLang;
  loading: boolean = false;
  categories: Lookup[] = [];
  servicesStatusEnum = ServicesStatus;

  constructor(
    private translateService: TranslateService,
    private httpHandlerService: HttpHandlerService,
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

  handleCategoryFilter(categoryId: number) {
    this.categoryFilterEvent.emit(categoryId);
  }

  handleStatusesFilter(status: number) {
    this.statusesFilterEvent.emit(status);
  }

  // get lookups for dropdowns
  getLookUps() {
    this.loading = true;
    const queryServiceDesk = {
      ServiceName: 'ServiceDesk',
    };
    this.httpHandlerService
      .get(Config.Lookups.lookupService, queryServiceDesk)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.categories = StructureLookups(res).Category;
      });
  }
}
