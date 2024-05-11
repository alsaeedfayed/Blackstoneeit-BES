import { Component, EventEmitter, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { followUpQueryParams } from '../../models/dashboard.model';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { Config } from 'src/app/core/config/api.config';
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-follow-up-filters',
  templateUrl: './follow-up-filters.component.html',
  styleUrls: ['./follow-up-filters.component.scss'],
})

export class FollowUpFiltersComponent implements OnInit {

  //TODO VARIABLES
  sectors: any
  departments: any
  sections: any
  selectedSector: any = { id: null }
  selectedDepartment: any = { id: null }
  selectedSection: any = { id: null }
  sectorId: number
  deptId: number;
  activeFromDate;
  activeToDate;
  activeSectorId: number
  activeDepartmentId: number
  activeSectionId: number
  language: string = this.translateService.currentLang
  showClear: boolean = false
  showClearToDate: boolean = false;
  filterForm: FormGroup;
  // fromDate: { day: number; month: number; year: number } = {
  //   day: 0,
  //   month: 0,
  //   year: 0,
  // }
  // toDate: { day: number; month: number; year: number } = {
  //   day: 0,
  //   month: 0,
  //   year: 0,
  // }
  // date: any = {
  //   day: 13,
  //   month: 9,
  //   year: 2023,
  // }

  //TODO EMITTERS
  @Output() FromDateEmitter = new EventEmitter()
  @Output() ToDateEmitter = new EventEmitter()
  @Output() sectorEmitter = new EventEmitter()
  @Output() departmentEmitter = new EventEmitter()
  @Output() sectionEmitter = new EventEmitter()

  @Output() onFilterEmitter = new EventEmitter();
  @Output() onCancelEmitter = new EventEmitter();

  constructor(
    private activatedRoute: ActivatedRoute, private translateService: TranslateService, private http: HttpHandlerService, private fb: FormBuilder
  ) {
    this.initFilterForm();
  }

  ngOnInit(): void {

    this.getSectors();

    this.handleLangChange()

    this.activatedRoute.queryParams.subscribe(
      (queryParams: followUpQueryParams) => {
        if (queryParams.FromDate) {
          this.activeFromDate = queryParams.FromDate;
          // let date = new Date(queryParams.FromDate)
          // //debugger
          // this.fromDate.day = date.getDate()
          // this.fromDate.month = date.getMonth() + 1
          // this.fromDate.year = date.getFullYear()
          this.showClear = true
        }
        if (queryParams.ToDate) {
          this.activeToDate = queryParams.ToDate;
          // let date = new Date(queryParams.ToDate)

          // this.toDate.day = date.getDate()
          // this.toDate.month = date.getMonth() + 1
          // this.toDate.year = date.getFullYear()
          this.showClearToDate = true
        }

        if (queryParams.SectorId) {
          this.activeSectorId = queryParams.SectorId
          this.sectorId = queryParams.SectorId
        }

        if (queryParams.DepartmentId) {
          this.activeDepartmentId = queryParams.DepartmentId
          this.deptId = queryParams.DepartmentId
        }

        if (queryParams.SectionId) {
          this.activeSectionId = queryParams.SectionId
        }
      },
    )
  }

  ngOnChanges(changes: SimpleChanges): void { }

  initFilterForm() {
    this.filterForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      sector: [null],
      department: [null],
      section: [null]
    })
  }

  //TODO ACTIONS

  filter() {
    // let data = {
    //   fromDate: this.formatDate(this.fromDate),
    //   toDate: this.formatDate(this.toDate),
    //   sector: this.selectedSector.id ? this.selectedSector.id : null,
    //   department: this.selectedDepartment.id ? this.selectedDepartment.id : null,
    //   section: this.selectedSection.id ? this.selectedSection.id : null
    // }
    let data = this.filterForm.value;
    if(data?.fromDate)
      data.fromDate = this.formatDate(data.fromDate);
    if(data?.toDate)
      data.toDate = this.formatDate(data.toDate);
    // debugger
    // if(data?.sector)
    //   data.sector = this.activeSectorId; //this.selectedSector.id;
    // if(data?.department)
    //   data.department = this.activeDepartmentId; // this.selectedDepartment.id;
    // if(data?.section)
    //   data.section = this.activeSectionId // this.selectedSection.id;
    data.fromDate ? (this.showClear = true) : (this.showClear = false);
    data.toDate ? (this.showClearToDate = true) : (this.showClearToDate = false);
    this.onFilterEmitter.emit(data);
    this.onCancelEmitter.emit();
  }

  cancel() {
    this.onCancelEmitter.emit();
  }

  handleFromDateFilter(date: any) {
    //this.fromDate = date;
    // this.FromDateEmitter.emit(this.formatDate(date))
    date ? (this.showClear = true) : (this.showClear = false)
  }

  handleToDateFilter(date: any) {
   // this.toDate = date;
   // this.ToDateEmitter.emit(this.formatDate(date))
    date ? (this.showClearToDate = true) : (this.showClearToDate = false)
  }

  handleSectorFilter(sectorId) {
    this.sectorEmitter.emit(sectorId)
    this.selectedDepartment.id = null
    this.departmentEmitter.emit(undefined)
    this.selectedSection.id = null
    this.sectionEmitter.emit(undefined)
    this.sectorId = sectorId
    if (!this.sectorId) {
      this.departments = []
      this.selectedDepartment.id = null
      this.sections = []
      this.selectedSection.id = null
      this.sectorId = null
      return
    }
    this.getDepartmentsBySectorId(sectorId).subscribe((res) => {
      this.departments = res
    })
  }

  handleDepartmentFilter(departmentId) {
    this.departmentEmitter.emit(departmentId)
    this.selectedSection.id = null
    this.sectionEmitter.emit(undefined)
    this.deptId = departmentId
    if (!this.deptId) {
      this.sections = []
      this.selectedSection.id = null
      this.deptId = null
      return
    }
    this.getSectionByDeptId(departmentId).subscribe((res) => {
      this.sections = res
     // console.log('id', departmentId, 'sections', this.sections)
    })
  }

  handleSectionFilter(sectionId) {
    this.sectionEmitter.emit(sectionId)
  }

  formatDate(date) {
    // if (typeof date == 'object') {
    //   const formattedDate = `${date?.year}-${date?.month}-${date?.day}`
    //   return moment(formattedDate, 'YYYY-MM-DD').format()
    // } else {
    //   console.log(date)
    //   return date
    // }

    const formattedDate = `${date?.year}-${date?.month}-${date?.day}`;
    return moment(formattedDate, 'YYYY-MM-DD').format()
  }

  formatDateToObject(date: string) {
    return {
      day: new Date(date).getDate(),
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
    }
  }

  getSectors() {
    this.http.get(`${Config.Dashboard.GetSectors}`).subscribe((res) => {
      this.sectors = res
      this.setFilters()
    })
  }

  getDepartmentsBySectorId(sectorId) {
    return this.http.get(
      Config.Lookups.getDepartments + '?sectorId=' + sectorId,
    )
  }

  getSectionByDeptId(deptID) {
    return this.http.get(
      Config.Lookups.getSections + '?departmentId=' + deptID,
    )
  }


  setFilters() {
    setTimeout(() => {
      if(this.activeFromDate)
          this.filterForm.get('fromDate').setValue(this.formatDateToObject(this.activeFromDate))
      if(this.activeToDate)
          this.filterForm.get('toDate').setValue(this.formatDateToObject(this.activeToDate))
      if (this.activeSectorId) {
        // debugger
        this.getDepartmentsBySectorId(this.activeSectorId).subscribe((res) => {
          this.departments = res
          const result = this.sectors.find(({ id }) => id == this.activeSectorId)
          if (result) {
          //  this.selectedSector = result
            //this.sectorId = result.id;
            this.filterForm.get('sector').setValue(result.id);
          }
          // debugger
          if (this.activeDepartmentId) {
            const deb = this.departments.find(
              ({ id }) => id == this.activeDepartmentId,
            )
            if (deb) {
              //this.selectedDepartment = deb
            //  this.deptId = deb.id;
              this.filterForm.get('department').setValue(deb.id);
            }

            this.getSectionByDeptId(this.activeDepartmentId).subscribe((res) => {
              this.sections = res

              const sec = this.sections.find(
                ({ id }) => id == this.activeSectionId,
              )
              if (sec) {

                // this.selectedSection = sec;
                this.filterForm.get('section').setValue(sec.id);
              }

            })

          }
        })
      }
    }, 500);
  }


  handleLangChange() {
    this.translateService.onLangChange.subscribe(() => {
      this.language = this.translateService.currentLang
    })
  }

  resetFromDate() {
    this.filterForm.get('fromDate').setValue(undefined);
  }

  resetToDate() {
    this.filterForm.get('toDate').setValue(undefined);
  }

}
