import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import moment from 'moment'
import { ServicesDashboardService } from '../../services/services-dashboard.service'
import { map } from 'rxjs/operators'
import { ActivatedRoute } from '@angular/router'
import { requestsQueryParams } from '../../models/dashboard.model'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-requests-filters',
  templateUrl: './requests-filters.component.html',
  styleUrls: ['./requests-filters.component.scss'],
})

export class RequestsFiltersComponent implements OnInit, OnChanges {
  //TODO VARIABLES
  categories: any
  selectedCategory: any = { id: null }
  activeCategoryId;
  activeFromDate;
  activeToDate;
  language: string = this.translateService.currentLang
 // fromDate: { day: number; month: number; year: number } = { day: 0, month: 0, year: 0 }
  //toDate: { day: number; month: number; year: number } = { day: 0, month: 0, year: 0 }
  showClear: boolean = false;
  showClearToDate: boolean = false;
  filterForm: FormGroup;

  //TODO EMITTERS
  @Output() FromDateEmitter = new EventEmitter();
  @Output() ToDateEmitter = new EventEmitter();
  @Output() CategoryEmitter = new EventEmitter();

  @Output() onFilterEmitter = new EventEmitter();
  @Output() onCancelEmitter = new EventEmitter();

  constructor(
    private servicesDashboard: ServicesDashboardService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private fb: FormBuilder
  ) {
    this.initFilterForm();
  }

  ngOnInit(): void {

    this.getCategories()

    this.handleLangChange()

    this.activatedRoute.queryParams.subscribe(
      (queryParams: requestsQueryParams) => {
        
        if (queryParams.CategoryId) {
          this.activeCategoryId = queryParams.CategoryId
        }
        if (queryParams.FromDate) {
          this.activeFromDate = queryParams.FromDate;
        //  let date = new Date(queryParams.FromDate)
          // this.fromDate.day = date.getDate()
          // this.fromDate.month = date.getMonth() + 1
          // this.fromDate.year = date.getFullYear()
          this.showClear = true
        }
        if (queryParams.ToDate) {

          this.activeToDate = queryParams.ToDate;
          //let date = new Date(queryParams.ToDate)

          // this.toDate.day = date.getDate()
          // this.toDate.month = date.getMonth() + 1
          // this.toDate.year = date.getFullYear()
          this.showClearToDate = true
        }

        this.setFilters();
      },
    )
  }

  ngOnChanges(changes: SimpleChanges): void { }

  initFilterForm() {
    this.filterForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      category: [null]
    })
  }

  //TODO ACTIONS

  filter() {
    let data = this.filterForm.value;
    if(data?.fromDate)
      data.fromDate = this.formatDate(data.fromDate);
    if(data?.toDate)
      data.toDate = this.formatDate(data.toDate);
    if(data?.category)
      data.category = this.selectedCategory.id;
    data.fromDate ? (this.showClear = true) : (this.showClear = false);
    data.toDate ? (this.showClearToDate = true) : (this.showClearToDate = false);
    this.onFilterEmitter.emit(data);
    this.onCancelEmitter.emit();
  }

  cancel() {
    this.onCancelEmitter.emit();
  }

  resetFromDate() {
    this.filterForm.get('fromDate').setValue(undefined);
  }

  resetToDate() {
    this.filterForm.get('toDate').setValue(undefined);
  }
  
  handleFromDateFilter(date: any) {
    // date = dayjs()
    // date = new Date(date?.['$d']?? date).toISOString(),
   // this.fromDate = date;
   // this.FromDateEmitter.emit(date);
    date ? (this.showClear = true) : (this.showClear = false)
   // return this.fromDate;
  }

  handleToDateFilter(date: any) {
   // this.toDate = date;
   // this.ToDateEmitter.emit(this.formatDate(date))
    date ? (this.showClearToDate = true) : (this.showClearToDate = false)
  }

  handleCategoryFilter(event) {
    this.selectedCategory.id = event;
   // this.CategoryEmitter.emit(event)
  }

  formatDate(date) {
    // if (typeof date == 'object') {
    //   const formattedDate = `${date?.year}-${date?.month}-${date?.day}`
    //   return moment(formattedDate, 'YYYY-MM-DD').format()
    // } else 
    //   return date
    const formattedDate = `${date?.year}-${date?.month}-${date?.day}`;
    return moment(formattedDate, 'YYYY-MM-DD').format()
  }

  getCategories() {
    const queryServiceDesk = {
      ServiceName: 'ServiceDesk',
    }
    this.servicesDashboard
      .getCategories(queryServiceDesk)
      .pipe(
        map((res: any) => {
          const categories = res.find(
            ({ lookupType }) => lookupType === 'Category',
          )
          return categories
        }),
      )
      .subscribe((res) => {
        this.categories = res.lookupResult;
        if (this.activeCategoryId) {
          const result = this.categories?.find(({ id }) => id == this.activeCategoryId)
          if (result) {
            this.selectedCategory = result
            this.filterForm.get('category').setValue(this.selectedCategory.id)
          }
        } 
      })
  }

  setFilters() {
    setTimeout(() => {
      if(this.activeFromDate)
          this.filterForm.get('fromDate').setValue(this.formatDateToObject(this.activeFromDate))
      if(this.activeToDate)
          this.filterForm.get('toDate').setValue(this.formatDateToObject(this.activeToDate))
      // if (this.activeCategoryId) {
      //   const result = this.categories?.find(({ id }) => id == this.activeCategoryId)
      //   if (result) {
      //     this.selectedCategory = result
      //     this.filterForm.get('category').setValue(this.selectedCategory.id)
      //   }
      // } 
    }, 500);
    //if(this.filters?.fromDate)
      //  this.filterForm.get('fromDate').setValue(this.formatDateToObject(this.filters?.fromDate));
    //if(this.filters?.toDate)
       // this.filterForm.get('toDate').setValue(this.formatDateToObject(this.filters?.toDate));
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe(() => {
      this.language = this.translateService.currentLang
    })
  }

  get getFilterForm() {
    return this.filterForm.controls
  }

  formatDateToObject(date: string) {
    return {
      day: new Date(date).getDate(),
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
    }
  }

}
