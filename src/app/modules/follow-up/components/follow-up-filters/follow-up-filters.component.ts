import { Component, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { StructureLookups } from 'src/app/utils/loockups.utils';
import { EventEmitter } from '@angular/core';
import { FollowupStatusMode } from '../table/enums';

@Component({
  selector: 'app-follow-up-filters',
  templateUrl: './follow-up-filters.component.html',
  styleUrls: ['./follow-up-filters.component.scss']
})
export class FollowUpFiltersComponent implements OnInit {
  loading: boolean;
  lookupsMeetingType: any[] = [];
  lang: string = '';
  status = [
    {
      name: "مفتوحة",
      nameEn: "Open",
      id: FollowupStatusMode.Open
    },
    {
      name: "مغلقة",
      nameEn: "Closed",
      id: FollowupStatusMode.Closed
    }
  ]

  @Input() isAdvancedFilterClicked: boolean = false;
  @Output() filter: EventEmitter<any> = new EventEmitter();


  filterValues: any = {};
  constructor(private modelService: ModelService, private http: HttpHandlerService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.getLookups();
    this.translateService.onLangChange.subscribe(value => {
      this.lang = value.lang;
    })
  }

  openPopup() {
    this.modelService.open('filter-item');
  }

  getLookups() {
    this.loading = true;
    const queryServiceDesk = {
      ServiceName: 'ServiceDesk',
    };
    const Lookups = this.http.get(
      Config.Lookups.lookupService,
      queryServiceDesk
    );


   // const sector = this.http.get(Config.FollowUp.GetMyHirerchy)
   // forkJoin({ Lookups, sector })
    forkJoin({ Lookups })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
       // console.log(res)
        this.lookupsMeetingType = StructureLookups(res?.Lookups)?.TaskType;
      });
  }

  handleOnlyMeFilter(e){
    this.filterValues.assignedToMe = e.target.checked;
    this.changeFilter()
  }

  changeFilter() {
    this.filter.emit(this.filterValues);
  }

  advancedFilter(filterData) {
    this.filterValues = { ...this.filterValues, ...filterData,  }
    this.changeFilter();
  }

}
