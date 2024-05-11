import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, forkJoin } from 'rxjs';
import { finalize, debounceTime } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { EnglishLettersAndNumbersOnly } from 'src/app/core/helpers/English-Letters-And-Numbers-Only.validator';
import { Lookup } from 'src/app/core/models/category';
import { ServicesStatus } from 'src/app/core/models/services-status';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ServicesType } from 'src/app/modules/requests/components/requests-filters/enums';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { StructureLookups } from 'src/app/utils/loockups.utils';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss'],
})

export class CreateServiceComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  selected = '1';
  loading: boolean = false;
  isBtnLoading: boolean = false;
  categories: Lookup[] = [];
  language: string = this.translateService.currentLang;
  targetAudience: Lookup[] = [];
  processes: any[] = [];
  agents: any[] = [];
  groups: any[] = [];
  roles: any[] = [];
  forms: any[] = [];
  servicesStatusEnum = ServicesStatus;
  @Input() service: any = null;
  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  //roles loading and search vars
  searchSubject = new Subject<string>();
  rolesSearchValue: string = '';
  rolesLoadCount: number = 1;
  gettingRoles = false;
  loadingRolesSlice = false;
  constructor(
    private fb: FormBuilder,
    private httpHandlerService: HttpHandlerService,
    private modelService: ModelService,
    private translateService: TranslateService,
    private toastr: ToastrService
  ) {
    //search for roles
    this.searchSubject.pipe(debounceTime(250)).subscribe((searchTerm: string) => {
      this.rolesLoadCount = 1;
      this.roles = [];
      this.getRoles();
    });
  }

  ngOnInit(): void {
    this.handleFormService();
    this.getLookups();
    this.handleResetData();
    this.handleLangChange();
    this.modelService.closeModel$.subscribe((data) => {
      if (!this.service) {
        this.form.reset();
      }
    });
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.language = language.lang;
    });
  }

  handleFormService(): void {
    this.form = this.fb.group({
      title: this.fb.control('', [
        Validators.required,
        EnglishLettersAndNumbersOnly(),
      ]),
      titleAr: this.fb.control('', [
        Validators.required,
        ArabicLettersAndNumbersOnly(),
      ]),
      description: this.fb.control(null, Validators.required),
      cateogryId: this.fb.control(null, Validators.required),
      // agentsIds: this.fb.control(null, Validators.required),
      targetAudienceId: this.fb.control(null, Validators.required),
      formId: this.fb.control(null),
      processId: this.fb.control(null, Validators.required),
      published: this.fb.control(false, Validators.required),
      roleIds: this.fb.control(null, Validators.nullValidator),
      groupIds: this.fb.control(null, Validators.nullValidator),
    });
    if (!!this.service) {
      this.handelOldValue();
    }
  }

  handelOldValue() {
    const data = {
      cateogryId: this.service?.cateogryId,
      title: this.service?.title,
      titleAr: this.service?.titleAr,
      formId: this.service?.formId,
      published: this.service?.published,
      targetAudienceId: this.service?.targetAudienceId,
      description: this.service?.description,
      processId: this.service?.processId,
      groupIds: this.service?.groupIds,
      roleIds: this.service?.roleIds,
      fixed: this.service?.fixed,
    };
    this.form.patchValue(data);
    this.service?.roleIds?.length > 0 && this.getRolesSlice(this.service?.roleIds);
  }

  getLookups() {
    this.loading = true;
    const queryServiceDesk = {
      ServiceName: 'ServiceDesk',
    };
    const Lookups = this.httpHandlerService.get(
      Config.Lookups.lookupService,
      queryServiceDesk
    );
    const process = this.httpHandlerService.post(
      Config.Lookups.lookupProcess +
      '?consumer=' +
      ServicesType[ServicesType.ServiceDesk]
    );
    // const queryGroups = {
    //   userId: this.userService.getCurrentUserId(),
    //   childrenDepth: 3,
    // };
    const lookupAgent = this.httpHandlerService.get(Config.Lookups.lookupAgent);
    const groups = this.httpHandlerService.get(Config.Groups.GetGroups);
    // const groups = this.httpHandlerService.get(Config.Lookups.lookupGroups, queryGroups);
    // const roles = this.httpHandlerService.get(Config.Lookups.lookupRoles);
    const forms = this.httpHandlerService.get(Config.Lookups.lookupForms);
    forkJoin({ Lookups, process, lookupAgent, groups, /*roles,*/ forms })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
        this.categories = StructureLookups(res.Lookups).Category;
        //this.targetAudience = StructureLookups(res.Lookups).TargetAudience;
        this.targetAudience = res.Lookups.filter(lookup => lookup.lookupType == 'TargetAudience')[0].lookupResult;
        this.processes = res.process.data;
        this.groups = res.groups;
        // this.roles = res.roles.data;
        this.forms = res.forms;
        this.handleDefaultAudience();
        this.handleAgentsFullName(res.lookupAgent);
      });
  }

  // get roles slice
  getRolesSlice(rolesId: string[]) {
    this.loadingRolesSlice = true;
    let body = {
      rolesIds: rolesId
    }
    this.httpHandlerService.post(Config.Lookups.GetRolesByIds, body)
      .pipe(finalize(() => { this.loadingRolesSlice = false }))
      .subscribe(res => {
        if (res) {
          res.activeRoles.forEach((role) => {
            this.roles.push(role);
          });
        }
      })
  }
  //get paginated roles 
  getRoles() {
    this.gettingRoles = true;
    let params = { pageIndex: this.rolesLoadCount, pageSize: 10, fullName: this.rolesSearchValue };
    this.httpHandlerService.get(Config.Lookups.lookupRoles, params)
      .pipe(finalize(() => { this.gettingRoles = false }))
      .subscribe(res => {
        if (res) {

          res.data.forEach((role) => {
            let duplicated = false;

            //check if duplicated roles exists
            for (const r of this.roles) {
              if (r.id == role.id) {
                duplicated = true;
                break;
              }
            }
            if (!duplicated) this.roles.push(role);
          });

        }
      })

  }
  //focus on search bar in roles selection
  onFocus() {
    this.rolesSearchValue = '';
    this.getRoles();
  }

  //search on roles selection
  searchRoles(value: any) {
    if (value.term.trim()) {
      this.rolesSearchValue = value.term.trim();
      this.searchSubject.next();
    }
  }

  //load more roles
  loadMoreRoles() {
    this.rolesLoadCount++;
    this.getRoles();
  }

  handleDefaultAudience() {
    if (!this.service) {
      if (this.targetAudience[0].status)
        this.form.get('targetAudienceId').setValue(this.targetAudience[0].id);
      else if (this.targetAudience[1].status)
        this.form.get('targetAudienceId').setValue(this.targetAudience[1].id);
      else
        this.form.get('targetAudienceId').setValue(this.targetAudience[2].id);
    }
  }

  handleResetData() {
    this.form.get('targetAudienceId').valueChanges.subscribe((res) => {
      this.form.get('groupIds').reset();
      this.form.get('roleIds').reset();
    });
  }

  createService() {
    this.isBtnLoading = true;
    if (!!this.service) {
      this.updateService();
      return;
    }
    const body = {
      ...this.form.value,
      cateogryName: this.categoryName,
      cateogryNameAr: this.categoryNameAr,
      // agentsIds: this.form.value.agentsIds?.join(),
      // agentsNames: this.agentsNames,
      process: this.processName,
      roleIds: this.form.value.roleIds?.join() || '0',
      groupIds: this.form.value.groupIds?.join() || '0',
      status: this.servicesStatusEnum.Started,
    };
    this.httpHandlerService
      .post(Config.Service.createService, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe((res) => {
        if (res.success) {
          this.closePopup();
          this.form.reset();
          this.update.emit();
        } else {
          this.toastr.error(res.message);
        }
      });
  }

  get agentsNames() {
    const names = [];
    this.agents.forEach((agent) => {
      if (this.form.value.agentsIds.includes(agent.id)) {
        names.push(agent.fullname);
      }
    });
    return names.join();
  }

  get categoryName() {
    const category = this.categories.find(
      (category) => this.form.value.cateogryId == category.id
    );
    return category?.nameEn;
  }

  get categoryNameAr() {
    const category = this.categories.find(
      (category) => this.form.value.cateogryId == category.id
    );
    return category?.nameAr;
  }

  get processName() {
    const process = this.processes.find(
      (process) => this.form.value.processId == process.id
    );
    // return process.title[this.language];
    return process.title;
  }

  get formName() {
    const form = this.forms.find((form) => this.form.value.formId == form.id);
    return form.name;
  }
  handleAgentsFullName(agents: any[]) {
    this.agents = agents.map((agent) => {
      return {
        ...agent,
        fullname: `${agent.firstName} ${agent.lastName}`,
      };
    });
  }

  closePopup() {
    this.modelService.close();
    if (!this.service) {
      this.form.reset();
    }
  }

  updateService() {
    this.isBtnLoading = true;
    const body = {
      ...this.form.value,
      cateogryName: this.categoryName,
      cateogryNameAr: this.categoryNameAr,
      process: this.processName,
      formName: this.formName,
      roleIds: this.form.value.roleIds?.join() || '0',
      groupIds: this.form.value.groupIds?.join() || '0',
      status: this.servicesStatusEnum.Started,
      serviceId: this.service.serviceId,
      updatedDate: new Date(),
    };
    this.httpHandlerService
      .post(Config.Service.updateService, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe((res) => {
        this.service = {
          ...this.service,
          ...body,
          roleIds: this.form.value.roleIds || [],
          groupIds: this.form.value.groupIds || [],
        };
        this.update.emit(this.service);
        this.closePopup();
      });
  }
}
