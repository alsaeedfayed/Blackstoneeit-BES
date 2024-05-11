import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, combineLatest } from 'rxjs';
import { debounceTime, takeUntil, finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { StructureLookups } from 'src/app/utils/loockups.utils';
import { BauDashboardService } from '../../services/bau-dashboard.service';

@Component({
  selector: 'app-bau-dashboard-filters',
  templateUrl: './bau-dashboard-filters.component.html',
  styleUrls: ['./bau-dashboard-filters.component.scss']
})
export class BauDashboardFiltersComponent extends ComponentBase implements OnInit, OnChanges {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;
  loading: boolean = false;

  @Output() filtersNumber: EventEmitter<number> = new EventEmitter();
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Input() isFiltersEmpty: boolean = false;
  @Input() showDateRangeValidatorInput: boolean

  filterValues: any = {};

  form: FormGroup;
  committeeTypes: any[] = [];
  committeeChairmans: any[] = [];
  statuses = [];

  //committee chairman search
  searchSubject = new Subject<string>();
  memberSearchValue: string = '';
  employeeLoadCount: number = 1;
  gettingEmployees = false;

  //sectors
  sectors: any[] = []
  //departments
  departments: any[] = []
  //sections
  sections: any[] = []
  //activities
  activities: any[] = []
  //years
  years : number [] = []

  //selected year
  selectedYear : number

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
    private BAUService : BauDashboardService

  ) {
    super(translateService, translate);


  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFiltersEmpty) this.initFilterFormControls();
  }

  startDate : any ;
  endDate : any
  currentyear : number
  ngOnInit(): void {
    this.currentyear = new Date().getFullYear();

    //TODO SET CURRENT AND PREVIOUS YEAR ONLY
    const currentYear = new Date().getFullYear();
    const previousYear =  currentYear-1;
    const nextYear = currentYear + 1
    this.form.controls['Year'].setValue(currentYear);
   // console.log('fv' , this.form.value)
    //console.log(this.endDate)

    this.years.push(currentYear , nextYear)


    //clear arrs in case clear filter
    this.BAUService.Filters$.subscribe(isClear => {
      if(isClear){
        this.departments = [];
        this.sections = []
        this.activities = []

      }
    })
    // handles language change event
    this.handleLangChange();

    //TODO INIT SECTORS
    this.getSectors()

    //TODO ACTIVITIES
    this.getActivities()

    // initialize filter form controls
    this.initFilterFormControls();

  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });

  }

  // TODO initialize filter form controls
  initFilterFormControls() {
    this.form = this.fb.group({
      SectorId: [null],
      DepartmentId: [null],
      SectionId: [null],
      FromDate: [null],
      ToDate: [null],
      MainTaskId: [null],
      Year: [this.currentyear]

    });
  }

  //TODO GET SECTORS
  getSectors() {
    this.httpSer.get(Config.FollowUp.GetMyHirerchy).subscribe(res => {
      this.sectors = res;
    });
  }

  //TODO GET ACTIVITY BY YEAR
  getActivities(){
   // console.log('selected year' , this.selectedYear);
    if(!this.selectedYear){
      const year = new Date().getFullYear();
      this.selectedYear= year;
    }
    this.httpSer.get(`${Config.BAU.Dashboard.getMainTasksByYear}/${this.selectedYear}`).subscribe(res => {
      this.activities = res;

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
    //console.log('filter values', this.filterValues)
    this.updateFilter();
  }

  //TODO SET SECTOR VALUE AND GET DEPARTMENTS
  setSectorValue(event) {
    this.form.controls['DepartmentId'].setValue(null);
    this.form.controls['SectionId'].setValue(null)
    this.departments = [];
    this.sections = []

    if (event) {
      const sector = this.sectors.find(sector => sector.id === event);
      this.departments = sector?.departments
    }
    else {
      this.form.controls['DepartmentId'].setValue(null);
      this.form.controls['SectionId'].setValue(null)
      this.departments = [];
      this.sections = []
    }

    this.changeFilter()
  }

  //TODO SET DEPARTMENT VALUE AND GET SECTION
  setDepartmentValue(event) {
    this.form.controls['SectionId'].setValue(null)
    this.sections = []
    if (event) {
      const section = this.departments.find(dept => dept.id === event);
      this.sections = section?.sections
    }
    this.changeFilter()
  }

  //TODO SET SECTION
  setSection(event) {
    this.changeFilter()
  }

  // TODO SET ACTIVITY
  setActivity(event) {
    this.changeFilter()
  }

  //TODO SET DATE
  setDate() {
    this.changeFilter()
  }

  year : number

  //TODO SET YEAR
  setYear(event){
    this.form.controls['FromDate'].setValue(null);
    this.form.controls['ToDate'].setValue(null);
    const currentYear = new Date().getFullYear();
    const previousYear =  currentYear-1;
    const nextYear = currentYear + 1
    if(event == null || event == undefined){
      this.form.controls['Year'].setValue(currentYear);
    }
    if(event === currentYear){
      this.year = currentYear;
      this.form.controls['FromDate'].setValue(null);
      this.form.controls['ToDate'].setValue(null);
      this.startDate = new Date(previousYear, 0, 1).toISOString();
      this.startDate  = new Date(currentYear, 0, 1).toISOString();
      this.endDate  = new Date(currentYear, 11, 31).toISOString();
      this.changeFilter()
    }
    else if(event === nextYear) {
      this.year = previousYear;
      this.startDate  = new Date(nextYear, 0, 1).toISOString();
      this.endDate  = new Date(nextYear, 11, 31).toISOString();
      this.form.controls['FromDate'].setValue(this.startDate);
      this.form.controls['ToDate'].setValue(this.startDate);

    }


    this.form.controls['MainTaskId'].setValue(null);
    this.activities = []
    this.changeFilter()
    if(event){
      this.selectedYear = event;
      this.getActivities()
    }

  }


  setFromDate(event){
   // console.log(event)
    if(event){
      this.form.controls['FromDate'].setValue(event.toISOString());
    }
    else {
      this.form.controls['FromDate'].setValue(event);
    }

    this.changeFilter()
  }

  setToDate(event){

    if(event){
      this.form.controls['ToDate'].setValue(event.toISOString());
    }
    else {
      this.form.controls['ToDate'].setValue(event);
    }

    this.changeFilter()
  }


}
