import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { Config } from 'src/app/core/config/api.config';
import { Service } from 'src/app/core/models/service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import * as moment from 'moment';
import { ModelService } from 'src/app/shared/components/model/model.service';

@Component({
  selector: 'app-requests-advanced-filter',
  templateUrl: './requests-advanced-filter.component.html',
  styleUrls: ['./requests-advanced-filter.component.scss']
})
export class RequestsAdvancedFilterComponent implements OnInit, OnChanges {
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  @Input() filters : any = {};

  lang: string = this.translateService.currentLang;
  form: FormGroup;
  requesters: any[] = [];
  services: Service[] = [];

  constructor(
    private fb: FormBuilder,
    private modelService: ModelService,
    private httpHandlerService: HttpHandlerService,
    private translateService: TranslateService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.handleLangChange();
    this.getLookUps();
    this.getUsers();
  }

  ngOnChanges() {
    this.setFilters();
  }

  setFilters(){
    if(this.filters){
      if(this.filters.serviceTitle)
        this.form.get('serviceTitle').setValue(this.filters.serviceTitle);
      if(this.filters.serviceTitleAr)
        this.form.get('serviceTitleAr').setValue(this.filters.serviceTitleAr);
      if(this.filters.requesterId)
        this.form.get('requesterId').setValue(this.filters.requesterId);
      if(this.filters.requestNumber)
        this.form.get('requestNumber').setValue(this.filters.requestNumber);
      if(this.filters.serviceId && parseInt(this.filters.serviceId))
        this.form.get('serviceId').setValue(parseInt(this.filters.serviceId));
      if(this.filters.rating)
        this.form.get('rating').setValue(this.filters.rating);
      if(this.filters.creationDate){
        this.filters.creationDate = this.filters.creationDate instanceof Object ? this.filters.creationDate : JSON.parse(this.filters.creationDate);
        if(this.filters.creationDate?.dateFrom){
          this.filters.creationDate.startDate = moment(this.filters.creationDate?.dateFrom?.split("T")[0]);
          this.filters.creationDate.endDate = moment(this.filters.creationDate?.dateTo?.split("T")[0]);
          this.form.get('creationDate').setValue(this.filters.creationDate);
        }
      }
      if(this.filters.updatedDate){
        this.filters.updatedDate = this.filters.updatedDate instanceof Object ? this.filters.updatedDate : JSON.parse(this.filters.updatedDate);
        if(this.filters.updatedDate?.dateFrom){
          this.filters.updatedDate.startDate = moment(this.filters.updatedDate?.dateFrom?.split("T")[0]);
          this.filters.updatedDate.endDate = moment(this.filters.updatedDate?.dateTo?.split("T")[0]);
          this.form.get('updatedDate').setValue(this.filters.updatedDate);
        }
      }
    }

  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  initForm() {
    this.form = this.fb.group({
      requesterId: this.fb.control(null),
      requestNumber: this.fb.control(null),
      serviceId: this.fb.control(null),
      creationDate: this.fb.control(null),
      updatedDate: this.fb.control(null),
      rating: this.fb.control(0)
    });
  }

  //get lookups for dropdowns
  public getLookUps() {
    // const requesterModel = {
    //   pageIndex: 1,
    //   pageSize: 1000,
    // };
    // const requesters = this.httpHandlerService.get(
    //   Config.UserManagement.GetAll,
    //   requesterModel
    // );
    const services = this.httpHandlerService.get(Config.Service.getService);

    //forkJoin({ requesters, services }).subscribe((res) => {
    forkJoin({ services }).subscribe((res) => {
    //  this.requesters = res.requesters.data;
      this.services = res.services;
    });
  }

  //search on users
  searchUsers(value: any) {
    if(value)
      this.getUsers(value?.term?.trim());
  }

  private getUsers(value = '') {
    const body = {
      pageIndex: 1,
      pageSize: 30,
      fullName: value
    };
    this.httpHandlerService.get(Config.UserManagement.GetAll, body)
      .subscribe((res) => {
        if(res) {
          this.requesters = res?.data;
        }
      });
  }

  setRating(rating) {
    this.form.controls.rating.setValue(rating);
  }

  onPopupClose() {
    this.modelService.close();
  }

  onFilterReset() {
    this.form.reset();
    this.onFilter.emit(this.form.value);
    this.onPopupClose();
  }

  onFilterConfirmed() {
    this.onFilter.emit(this.form.value);
    this.onPopupClose();
  }

}
