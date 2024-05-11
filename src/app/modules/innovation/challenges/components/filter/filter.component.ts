import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from "@angular/core";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ComponentBase} from "src/app/core/helpers/component-base.directive";
import {HttpHandlerService} from "src/app/core/services/http-handler.service";
import {TranslateConfigService} from "src/app/core/services/translate-config.service";
import {UserService} from "src/app/core/services/user.service";
import {ModelService} from "src/app/shared/components/model/model.service";
import {ExportFilesService} from "src/app/shared/services/export-files/export-files.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Config} from "../../../../../core/config/api.config";
import {catchError, distinctUntilChanged, finalize, switchMap, tap} from "rxjs/operators";
import {concat, Observable, of, Subject} from "rxjs";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-challenge-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent extends ComponentBase implements OnInit {
  lockupsData: any = []
  focusArea: any
  filterValues = {}
  filterForm: FormGroup;
  @Input() emptyFilter: boolean = false;
  language: string = this.translate.currentLang;
  @Output() formValue = new EventEmitter();
  people$: Observable<any>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  selectedPersons: any[] = <any>[{name: 'Karyn Wright'}, {name: 'Other'}];
  pageIndex = 1
  usersList: any = []

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private userSer: UserService,
    private FormBuilder: FormBuilder,
    private modelService: ModelService,
    private exportFilesService: ExportFilesService
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {
    this.initFilterForm()
    this.lockups()
    this.getUsersList('')
  }

  initFilterForm() {
    this.filterForm = this.FormBuilder.group({
      status: [null,],
      organizerName: [null, Validators.maxLength(100)],
      focusArea: [null,],
    })
  }

  lockups() {
    const queryServiceDesk = {ServiceName: 'Innovation'};
    this.httpSer
      .get(`${Config.Lookups.lookupService}`, queryServiceDesk)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if (res) {
          this.lockupsData = res
          this.focusArea = this.getLookupResult('ChallengeFocusArea')
          console.log(this.focusArea)
        }
      });
  }

  getLookupResult(lookupType) {
    const result = this.lockupsData.find(item => item.lookupType === lookupType);
    return result ? result.lookupResult : null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.emptyFilter == true) this.resetFilter()

  }

  resetFilter() {
    this.filterForm.reset();
    Object.keys(this.filterValues).forEach(key => delete this.filterValues[key]);
    this.formValue.emit(this.filterValues)
  }

  setFilterValues() {
    console.log(this.filterForm.value)
    this.filterValues['focusArea'] = JSON.stringify(this.filterForm.controls.focusArea.value)
    this.filterValues['organizersIds'] = this.filterForm.controls.organizerName.value?.length > 0 ? JSON.stringify(this.convertCreatedByToArray(this.filterForm.controls.organizerName.value)) : ''
    this.filterValues['statuses'] = JSON.stringify(this.filterForm.controls.status.value)
    this.removeNullValues(this.filterValues);
    this.formValue.emit(this.filterValues)
  }


  convertCreatedByToArray(items) {
    let results = []
    items.map(item => {
      results.push(item.id)
    });
    return results
  }

  removeNullValues(obj) {
    for (const key in obj) {
      if (obj[key] === null) {
        delete obj[key];
      }
    }
  }

  trackByFn(item: any) {
    return item.id;
  }

  public loadPeople() {
    this.pageIndex++;
    this.getUsersList('')
  }

  public getUsersList(term) {
    this.peopleLoading = true
    this.httpSer.get(Config.UserManagement.GetAll, {
      pageIndex: this.pageIndex,
      pageSize: 10,
      fullName: term
    }).pipe(finalize(() => {
      this.peopleLoading = false
    })).subscribe(res => {
      console.log(res)
      if (this.pageIndex == 1) {
        this.usersList = res.data
      } else {
        this.usersList.push(...res.data)
      }
      console.log(this.usersList)
    })
  }
}
