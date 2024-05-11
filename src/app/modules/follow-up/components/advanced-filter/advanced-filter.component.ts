import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { forkJoin } from 'rxjs';
import { StructureLookups } from 'src/app/utils/loockups.utils';
import { FollowupStatusMode } from '../table/enums';

@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.scss']
})
export class AdvancedFilterComponent implements OnInit {

  @Output() filter: EventEmitter<any> = new EventEmitter();

  sector: any[] = [];
  lang: string = this.translateService.currentLang;
  form: FormGroup;
  department: any[] = [];
  section: any[] = [];
  dateRange: any = {};
  users: any[] = [];
  member: any[] = [];
  commitee: any[] = [];
  types: any[] = [];
  statuses: any[] = [
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
  ];

  statuses2: any[] = [
    {
      name: "وفق الخطة",
      nameEn: "OnTrack",
      id: 1
    },
    {
      name: "متأخر",
      nameEn: "Delayed",
      id: 2
    }
  ];

  constructor(private http: HttpHandlerService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private modelService: ModelService) { }

  ngOnInit(): void {

    // this.getUsers();
    this.handelForm();
    this.getMyHirerchy();
    this.getCommitee();
    this.getTypes();

    // handles language change event
    this.handleLangChange();
  }
  // handles language change event
  handleLangChange() {
    this.translateService.onLangChange.subscribe(value => {
      this.lang = this.translateService.currentLang;
      this.form.get('type').setValue(1);
    })
  }
  getTypes() {
    const queryServiceDesk = {
      ServiceName: 'ServiceDesk',
    };
    const Lookups = this.http.get(
      Config.Lookups.lookupService,
      queryServiceDesk
    );
    forkJoin({ Lookups })
      .pipe()
      .subscribe((res: any) => {
        this.types = StructureLookups(res?.Lookups)?.TaskType;
      });

  }

  handelForm() {
    this.form = this.fb.group({
      sector: this.fb.control(null),
      department: this.fb.control(null),
      section: this.fb.control(null),
      dateRange: this.fb.control(null),
      creationDateRange: this.fb.control(null),
      actualClosedDateRange: this.fb.control(null),
      Assignee: this.fb.control(null),
      requestCreator: this.fb.control(null),
      status: this.fb.control(null),
      ResponseStatus: this.fb.control(null),
      type: this.fb.control(1),
      typeCode: this.fb.control(null),
      id: this.fb.control(null),
      title: this.fb.control(null),
      commitee: this.fb.control(null),
    })
    this.handelSelectSerctor();
    this.handelSelectType();
  }

  handelSelectType() {
    this.form.get('type').setValue(1);
    this.form.get('type').valueChanges.subscribe(data => {
      this.form.get('section').reset();
      this.form.get('Assignee').reset();
      this.form.get('sector').reset();
      this.form.get('department').reset();
      this.form.get('commitee').reset();
    })
  }

  // //search on users
  // searchUsers(value: string) {
  //   if(value) 
  //     this.getUsers(value?.trim());
  // }

  // private getUsers(value = '') {
  // // this.loading = true;
  //   const body = {
  //     pageIndex: 1,
  //     pageSize: 30,
  //     fullName: value
  //   };
  //   this.http.get(Config.UserManagement.GetAll, body)
  //     .subscribe((res) => {
  //       this.users = res?.data;
  //     });
  // }

  getUsers(groupId) {
    this.form.get('Assignee').setValue(null);
    this.http.get(Config.UserManagement.GroupId, { groupId }).subscribe((res) => {
      this.users = res;
    })
  }

  handelSelectSerctor() {
    const sector = this.form.get('sector');
    const department = this.form.get('department');
    const section = this.form.get('section');

    sector.valueChanges.subscribe(value => {
      //if (!value) return;
      this.form.get('department').setValue(null);
      this.handelFindDepartments(value);
    })
    department.valueChanges.subscribe(value => {
      //if (!value) return;
      this.form.get('section').setValue(null);
      this.handelFindSections(value);
    })
    section.valueChanges.subscribe(value => {
      //if (!!value) 
      let groupId = value ? value : 
                    this.form.get('department').value ? this.form.get('department').value : this.form.get('sector').value
        this.getUsers(groupId);
    })
  }

  handelFindDepartments(sectorid: number) {
    const sector = this.sector.find(sector => sectorid == sector.id);
    this.department = sector ? sector.departments : [];
    if (!this.form.get('department').value) {
      this.getUsers(sectorid);
    }
  }

  handelFindSections(departmentid: number) {
    const department = this.department.find(department => departmentid == department.id);
    this.section = department ? department.sections : [];
    let groupId = departmentid ? departmentid : this.form.get('sector').value
    if (!this.form.get('section').value) {
        this.getUsers(groupId);
    }
  }

  resetFilters() {
    this.form.reset();
    const value = {
      ...this.form.value,
      'CloseDate.DateFrom': null,
      'CloseDate.DateTo': null,
      'CreatedBy': null,
      'Status': null,
      'typeCode': null,
      'Code': null,
      'Title': null,
      'groupId': null,
      'RelatedTo': null,
      'ResponseStatus': null,
      'DueDate.dateFrom': this.form.value?.dateRange?.[0] ? new Date(this.form.value?.dateRange?.[0])?.toISOString() : null,
      'DueDate.dateTo': this.form.value?.dateRange?.[1] ? new Date(this.form.value?.dateRange?.[1])?.toISOString() : null,
      'CreationDate.DateFrom': this.form.value?.creationDateRange?.[0] ? new Date(this.form.value?.creationDateRange?.[0])?.toISOString() : null,
      'CreationDate.dateTo': this.form.value?.creationDateRange?.[1] ? new Date(this.form.value?.creationDateRange?.[1])?.toISOString() : null,
    }
    this.form.get('type').setValue(1);
    delete value.dateRange;
    delete value.creationDateRange;
    this.filter.emit(value);
    this.close();
  }

  getMyHirerchy() {
    this.http.get(Config.FollowUp.GetMyHirerchy).subscribe(res => {
      this.sector = res;
    })
  }

  close() {
    this.modelService.close();
  }

  save() {
    const value = {
      // ...this.form.value,
      'CloseDate.DateFrom': this.form.value?.actualClosedDateRange?.[0] ? new Date(this.form.value?.actualClosedDateRange?.[0])?.toISOString() : null,
      'CloseDate.DateTo': this.form.value?.actualClosedDateRange?.[1] ? new Date(this.form.value?.actualClosedDateRange?.[1])?.toISOString() : null,
      'CreatedBy': this.form.value?.requestCreator,
      'Status': this.form.value?.status,
      'ResponseStatus': this.form.value?.ResponseStatus,
      'TypeCode': this.form.value?.typeCode ? this.form.value?.typeCode : null,
      'Code': this.form.value?.id ? this.form.value?.id : null,
      'Title': this.form.value?.title ? this.form.value?.title : null,
      'Assignee': this.form.value?.Assignee,
      'groupId': this.form.value?.commitee || this.form.value?.section || this.form.value?.department || this.form.value?.sector,
      'DueDate.dateFrom': this.form.value?.dateRange?.[0] ? new Date(this.form.value?.dateRange?.[0])?.toISOString() : null,
      'DueDate.dateTo': this.form.value?.dateRange?.[1] ? new Date(this.form.value?.dateRange?.[1])?.toISOString() : null,
      'CreationDate.DateFrom': this.form.value?.creationDateRange?.[0] ? new Date(this.form.value?.creationDateRange?.[0])?.toISOString() : null,
      'CreationDate.dateTo': this.form.value?.creationDateRange?.[1] ? new Date(this.form.value?.creationDateRange?.[1])?.toISOString() : null,
      'RelatedTo': (this.form.value?.commitee || this.form.value?.section || this.form.value?.department || this.form.value?.sector) ? this.form.value?.type : null
    }
    delete this.form.value.dateRange;
    delete this.form.value.creationDateRange;
    this.filter.emit(value);
    this.close();
  }

  getMembers() {
    if(this.form.get('commitee').value) {
      this.form.get('Assignee').setValue(null);
      this.http.get(Config.Committees.Members + this.form.get('commitee').value).subscribe((res) => {
        this.member = res;
      })
    }
  }

  getCommitee() {
    this.http.get(Config.Committees.GetAllActive).subscribe(data => {
      this.commitee = data;
    })
  }

}
