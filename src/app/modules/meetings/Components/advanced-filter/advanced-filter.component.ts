import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import * as moment from 'moment';

@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.scss']
})
export class AdvancedFilterComponent implements OnInit, OnChanges {
  sector: any[] = [];
  lang: string = '';
  form: FormGroup;
  department: any[] = [];
  section: any[]=[];
  dateRange: any = {};
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Input() filters : any;
  users: any[] = [];
  member: any[] = [];
  commitee: any[] = [];
  types: any[] = [];
  statuses = [
    { id: 1, 
      name : 'مسودة',
      nameEn : 'Draft'
    },
    {
      id: 2,
      name : "قيد المراجعة",
      nameEn : 'Under Review'
    },
    { id: 3, 
      name : "معتمد",
      nameEn : 'Approved'
    },
  ];

  constructor(
    private translateService: TranslateService,
    private fb: FormBuilder,
    private http: HttpHandlerService,
    private modelService: ModelService,
  ) {
    this.getCommitee();
    this.handelForm();
   }

  ngOnInit(): void {
    this.getUsers();
    this.translateService.onLangChange.subscribe(value => {
      this.lang = value.lang;
    })
  }

  ngOnChanges(){
    if(this.filters?.startDate){
      this.form.get('fromDate').setValue(this.formatDateToObject(this.filters?.startDate));
    }
    if(this.filters?.endDate){
      this.form.get('toDate').setValue(this.formatDateToObject(this.filters?.endDate));
    }
    if(this.filters?.status){
      this.form.get('status').setValue(this.filters?.status);
    }
    if(this.filters?.initiator){
      this.form.get('meetingInitiator').setValue(this.filters?.initiator);
    }
    if(this.filters?.CreatedBy){
      this.form.get('createdBy').setValue(this.filters?.CreatedBy);
    }
    if(this.filters?.Number){
      this.form.get('id').setValue(this.filters?.Number);
    }
    if(this.filters?.Title){
      this.form.get('title').setValue(this.filters?.Title);
    }
    if(this.filters?.Chairperson){
      this.form.get('meetingChairperson').setValue(this.filters?.Chairperson);
    }
    if(this.filters?.commitee){
      this.form.get('commitee').setValue(parseInt(this.filters?.commitee));
    }
  }

  handelForm() {
    this.form = this.fb.group({
      id: this.fb.control(null),
      title: this.fb.control(null),
      status: this.fb.control(null),
      createdBy : this.fb.control(null),
      fromDate: this.fb.control(null),
      toDate: this.fb.control(null),
      meetingChairperson: this.fb.control(null),
      meetingInitiator: this.fb.control(null),
      commitee: this.fb.control(null),
    })
  }

  public get isInvalidDateRange(): boolean {
    const fromDateControl = this.form.controls.fromDate;
    const toDateControl = this.form.controls.toDate;

    if (
      (fromDateControl.dirty && toDateControl.dirty) &&
      fromDateControl.value &&
      toDateControl.value &&
      !this.isDateRangeValid(fromDateControl.value, toDateControl.value)
    ) {
      toDateControl.setErrors({ 'invalidDateRange': true });
      return true;
    } else {
      toDateControl.setErrors(null);
      return false;
    }
  }

  isDateRangeValid(fromDate, toDate) {
    const from = new Date(fromDate.year, fromDate.month - 1, fromDate.day);
    const to = new Date(toDate.year, toDate.month - 1, toDate.day);

    return from <= to;
  }

  //search on users
  searchUsers(value: string) {
    if(value) 
      this.getUsers(value?.trim());
  }

  private getUsers(value = '') {
   // this.loading = true;
    const body = {
      pageIndex: 1,
      pageSize: 30,
      fullName: value
    };
    this.http.get(Config.UserManagement.GetAll, body)
      .subscribe((res) => {
        this.users = res?.data;
      });
  }

  resetFilters() {
    this.form.reset();
    const value = {
      ...this.form.value,
      'CreatedBy': null,
      'status': null,
      'Number': null,
      'Title': null,
      'startDate': null,
      'endDate': null,
      'Chairperson' : null,
      'initiator' : null,
      'commitee' : null
    }
    this.filter.emit(value);
    this.close();
  }

  close() {
    this.modelService.close();
  }

  formatDate(date) {
    if(typeof date == "object"){
      const formattedDate = `${date?.year}-${date?.month}-${date?.day}`;
      return new Date(formattedDate).toISOString();
    }else{
      return date;
    }
  }

  formatDateToObject(date: string) {
    return {
      day: new Date(date).getDate(),
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
    }
  }

  save() {
    const value = {
     // ...this.form.value,
      'CreatedBy': this.form.value?.createdBy,
      'status': this.form.value?.status,
      'Number': this.form.value?.id,
      'Title': this.form.value?.title,
      'startDate': this.form.value?.fromDate? this.formatDate(this.form.value?.fromDate) : null,
      'endDate': this.form.value?.toDate? this.formatDate(this.form.value?.toDate) : null,
      'Chairperson' : this.form.value?.meetingChairperson,
      'initiator' : this.form.value?.meetingInitiator,
      'commitee' : this.form.value?.commitee
    }
    delete this.form.value.dateRange;
    delete this.form.value.creationDateRange;
    this.filter.emit(value);
    this.close();
  }

  getCommitee(){
    this.http.get(Config.Committees.GetAllActive).subscribe(data => {
      this.commitee = data;
    })
  }

}
