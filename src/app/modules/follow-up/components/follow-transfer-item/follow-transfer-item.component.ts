import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { StructureLookups } from 'src/app/utils/loockups.utils';

@Component({
  selector: 'app-follow-transfer-item',
  templateUrl: './follow-transfer-item.component.html',
  styleUrls: ['./follow-transfer-item.component.scss']
})
export class FollowTransferItemComponent implements OnInit, OnDestroy {
  private endSub$ = new Subject();
  sector: any[] = [];
  department: any[] = [];
  member: any[] = [];
  commitee: any[] = [];
  section: any[] = [];
  form: FormGroup;
  lang: string = this.translateService.currentLang;
  functions: any[] = [];
  loading: boolean = false;
  lookupsMeetingType: any[] = [];
  users: any[] = [];
  btnLoading: boolean = false;
  attachments: any[] = [];
  public prevUploadedFiles: { fileName: string; extension: string }[] = [];
  @Input() item: any = null;
  @Output() types = new EventEmitter();
  @Output() itemTransferHandler = new EventEmitter();

  constructor(private http: HttpHandlerService, private fb: FormBuilder, private translateService: TranslateService, private modelService: ModelService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.handelForm();
    this.getLookups();
    if(!this.item){
      this.form.get('type').setValue(1);
    }
    this.translateService.onLangChange.subscribe(value => {
      this.lang = value.lang;
      if(!this.item){
        this.form.get('type').setValue(1);
      }
    })
  }

  handelForm() {
    this.form = this.fb.group({
      sector: this.fb.control(null, [Validators.required]),
      type: this.fb.control(1, [Validators.required]),
      department: this.fb.control(null),
      section: this.fb.control(null),
      commitee: this.fb.control(null),
      assginee: this.fb.control(null, Validators.required),
      //reason: this.fb.control(null, Validators.required),
    })
    this.handelSelectSerctor();
    this.handelSelectDepartments();
    this.handelSelectSections();
    this.handelSelectType();
    this.modelService.closeModel$.subscribe((data) => {
      if (!this.item) {
        this.form.reset();
      }
    });
  }

  handelSelectType(){
    this.form.get('type').setValue(1);
    this.form.get('type').valueChanges.subscribe(data => {
      this.form.get('section').reset();
      this.form.get('assginee').reset();
      this.form.get('sector').reset();
      this.form.get('department').reset();
      this.form.get('commitee').reset();
      if(data == 1){
        this.form.get('sector').setValidators([Validators.required]);
        this.form.get('commitee').clearValidators();
        this.form.get('commitee').updateValueAndValidity();
        this.form.get('sector').updateValueAndValidity();
      }else{
        this.form.get('commitee').setValidators([Validators.required]);
        this.form.get('commitee').updateValueAndValidity();
        this.form.get('sector').clearValidators();
        this.form.get('sector').updateValueAndValidity();
      }
    })
  }

  handelOldValue() {
    if (!!this.item) {
      this.loading = true;
      if (!!this.item.id) 
        this.http.get(`${Config.FollowUp.GetActionItem}/${+this.item.id}`).pipe(takeUntil(this.endSub$),finalize(()=>this.loading = false)).subscribe((item) => {
          this.item.sectorId = item?.sectorId;
          this.item.departmentId = item?.departmentId;
          this.item.sectionId = item?.sectionId;
          const data = {
            type : item.committeeId ? 2  : 1,
            action: item.action,
            meetingTypeCode: item.typeCode,
            dueDate: item.dueDate,
            department: this.item?.departmentId,
            section: this.item?.sectionId,
            sector: item?.sectorId,
            commitee : item.committeeId,
            assginee: item.assginee,
          }
          this.prevUploadedFiles = item?.attachments
          this.form.patchValue(data);
          if(item.committeeId){
            this.getMembers();
          }
        })
    }
  }

  handelSelectSerctor() {
    const sector = this.form.get('sector');
    sector.valueChanges.subscribe(value => {
     // if (!value) return;
      this.form.get('department').setValue(null);
      this.handelFindDepartments(value);
    })
  }

  handelFindDepartments(sectorid: number) {
    const sector = this.sector.find(sector => sectorid == sector.id);
    this.department = sector?.departments || [];
    //if (this.department.length == 0) {
    if (!this.form.get('department').value) {
      this.getUsers(sectorid);
    }
    if (!!this.item?.departmentId) {
      if(sector?.id == this.item?.sectorId)
        this.form.get('department').setValue(this.item?.departmentId);
      else {
        this.form.get('department').setValue(null);
        this.form.get('section').setValue(null);
      }
    }
  }

  handelFindSections(departmentid: number) {
    const department = this.department.find(department => departmentid == department.id);
    this.section = department?.sections || [];
    let groupId = departmentid ? departmentid : this.form.get('sector').value
    //if (this.department.length == 0) {
    if (!this.form.get('section').value) {
      this.getUsers(groupId);
      // this.getUsers(departmentid);
    }
    if (!!this.item?.sectionId) {
      if(department?.id == this.item?.departmentId)
        this.form.get('section').setValue(this.item?.sectionId);
      else
        this.form.get('section').setValue(null);
    }
  }

  handelSelectDepartments() {
    const department = this.form.get('department');
    department.valueChanges.subscribe(value => {
     // if (!value) return;
      this.form.get('section').setValue(null);
      this.handelFindSections(value);
     // if (!!value) this.getUsers(value);
    })
  }

  handelSelectSections() {
    const section = this.form.get('section');
    section.valueChanges.subscribe(value => {
        // if (!!value) this.getUsers(value);
        let groupId = value ? value : 
        this.form.get('department').value ? this.form.get('department').value : this.form.get('sector').value
        this.getUsers(groupId);
    })
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

    const sector = this.http.get(Config.FollowUp.GetMyHirerchy)
    const commitee = this.http.get(Config.Committees.GetAllActive);
    const hirerchy = this.http.get(Config.FollowUp.GetMyHirerchy)
    forkJoin({ Lookups, sector, hirerchy, commitee })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
        this.sector = res.hirerchy;
        this.lookupsMeetingType = StructureLookups(res?.Lookups)?.TaskType;
        this.types.emit(this.lookupsMeetingType);
        this.commitee = res.commitee;
        this.handelOldValue()
      });
  }

  transferTask() {
    this.btnLoading = true;
    if(this.form.valid){
      const sector = this.form.get('sector').value;
      const department = this.form.get('department').value;
      const section = this.form.get('section').value;
      const commitee = this.form.get('commitee').value;
      const body = {
        id : this.item.id,
        assginee : this.form.value.assginee,
        groupId: commitee || section || department || sector,
        relatedTo: this.form.get('type').value
       // reason: this.form.value.reason
      }
      this.http.put(Config.FollowUp.transferTask, body).pipe(finalize(() => this.btnLoading = false)).subscribe(res => {
        // this.sector = res;
        this.close();
        this.toastr.success(this.translateService.instant('shared.transferedSuccessfully'));
        this.itemTransferHandler.emit();
      })
    }
  }

  getUsers(groupId) {
    this.form.get('assginee').setValue(null);
    this.http.get(Config.UserManagement.GroupId, { groupId }).subscribe((res) => {
      this.users = res;
    })
  }

  getMembers(){
    if(this.form.get('commitee').value) {
      if(!this.item){
        this.form.get('assginee').setValue(null);
      }
      this.http.get(Config.Committees.Members+this.form.get('commitee').value).subscribe((res) => {
        this.member = res;
      })
    }
  }

  close() {
    this.modelService.close()
    if (this.item == null) {
      // this.form.reset();
    }
  }

  public deleteAttachment(i) {
    let attachment = this.attachments[i];
    if (attachment)
      this.attachments.splice(i, 1);
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }

}
