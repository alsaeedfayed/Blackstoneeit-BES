import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, Output, EventEmitter, OnChanges, Input } from '@angular/core';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { Config } from 'src/app/core/config/api.config';
import { ActivatedRoute } from '@angular/router';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { MainTask } from 'src/app/modules/committees-management/requests/models/MainTask';

@Component({
  selector: 'app-tasks-filter',
  templateUrl: './tasks-filter.component.html',
  styleUrls: ['./tasks-filter.component.scss']
})
export class TasksFilterComponent extends ComponentBase implements OnInit, OnChanges {

  private endSub$ = new Subject();


  language: string = this.translate.currentLang;
  loading: boolean = false;

  // Status.
  // Objective.
  @Output() filtersNumber: EventEmitter<number> = new EventEmitter();
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Input() isFiltersEmpty: boolean = false;
  @Input() filteredWorkgroupId: number = null;

  filterValues: any = {};
  setSortDirection: boolean = false;

  form: FormGroup;
  workgroups: any[] = [];
  committeeId: number = 0;
  mainTasks: MainTask[] = [];
  importanceLevel = [
    { id: 0, name: 'Low', nameAr: 'منخفض', className: 'lowLevel' },
    { id: 1, name: 'Medium', nameAr: 'متوسط', className: 'mediumLevel' },
    { id: 2, name: 'High', nameAr: 'عالي', className: 'highLevel' },
  ];

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
  ) {
    super(translateService, translate);
  }
  ngOnChanges(changes): void {
    if (this.isFiltersEmpty) this.initFilterFormControls();

    if (this.filteredWorkgroupId) {
      setTimeout(() => { this.changeFilter() });
    }
  }

  ngOnInit(): void {
    // handles language change event
    this.committeeId = +this.route.snapshot.parent.params['id'];

    // handles language change event
    this.handleLangChange();

    // initialize filter form controls
    this.initFilterFormControls();

    // get all committee work Groups
    this.getAllWorkGroups();
    
    // get main task 
    this.getMainTasks();
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });

  }

  // initialize filter form controls
  initFilterFormControls() {
    this.form = this.fb.group({
      importanceLevel: this.fb.control(null),
      mainTaskId: this.fb.control(null),
      workgroupId: this.fb.control(this.filteredWorkgroupId),
    });
  }
  // Main tasks list
  getMainTasks() {
    this.httpSer.get(`${Config.CommitteeMainTask.GetAllByCommitteeId}/${this.committeeId}`)
      .subscribe((res: MainTask[]) => {
        this.mainTasks = res;
      });
  }

  // fetch all work groups
  private getAllWorkGroups() {

    // send a request to fetch work groups
    this.httpSer
      .get(`${Config.WorkGroup.GetAllByCommitteeId}/${this.committeeId}`)
      .subscribe((res) => {
        if (res) {
          // all items list
          this.workgroups = res?.workgroups?.data;
        }
      });
  }
  // emit filter values
  public updateFilter() {
    this.filter.emit(this.filterValues);
    this.isFiltersEmpty = false;
    let filterCounts = Object.values(this.filterValues).filter(v => v != null).length;
    this.filtersNumber.emit(filterCounts)
  }

  // change filter values
  changeFilter() {
    this.filterValues = {
      ...this.filterValues,
      ...this.form.value,
    };
    this.updateFilter();
  }

  // set importance level value
  setImportanceLevelValue(value) {
    this.form.controls.importanceLevel.setValue(value);
    this.changeFilter()

  }
}