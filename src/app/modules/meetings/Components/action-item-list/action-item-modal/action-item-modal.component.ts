import {HttpClient, HttpHeaders} from '@angular/common/http';
import {OnDestroy} from '@angular/core';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {forkJoin, Subject} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {Config} from 'src/app/core/config/api.config';
import {HttpHandlerService} from 'src/app/core/services/http-handler.service';
import {UserService} from 'src/app/core/services/user.service';
import {ModelService} from 'src/app/shared/components/model/model.service';
import {IActionItem} from '../../../Pages/meeting-details/iMeetingDetails.interface';
import {licenceKey} from 'src/license/license';

@Component({
  selector: 'app-action-item-modal',
  templateUrl: './action-item-modal.component.html',
  styleUrls: ['./action-item-modal.component.scss'],
})
export class ActionItemModalComponent implements OnInit, OnDestroy {
  private endSub$ = new Subject();
  public isEditMode: boolean = false;
  public isFirstEditMode: boolean = false;
  public form: FormGroup = new FormGroup({});
  public loading: boolean = false;
  public isBtnLoading: boolean = false;
  public lang: string = this.translateService.currentLang;
  public users: any[] = [];
  public editedItem: IActionItem;
  public fullDetailsItem: any;
  public sector: any[] = [];
  public department: any[] = [];
  public member: any[] = [];
  public commitee: any[] = [];
  section: any[] = [];
  public isGettingUsers: boolean = false;
  attachments: any[] = [];
  public prevUploadedFiles: { fileName: string; extension: string }[] = [];

  @Output() save: EventEmitter<IActionItem> = new EventEmitter();
  @Output() update: EventEmitter<IActionItem> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() createdMeetingId: string;

  @Input()
  public set Item(editedItem: IActionItem) {
    this.editedItem = editedItem;
  }

  constructor(
    private fb: FormBuilder,
    private httpHandlerService: HttpHandlerService,
    private modelService: ModelService,
    private translateService: TranslateService,
    private _http: HttpClient, private userService: UserService,
  ) {
    this.initForm();
    this.getLookups();
  }

  ngOnInit(): void {
    this.handleLangChange();
  }

  private getUsers(groupId) {
    this.form.get('assginee').setValue(null);
    this.isGettingUsers = true;
    this.httpHandlerService
      .get(Config.UserManagement.GroupId, {groupId})
      .pipe(takeUntil(this.endSub$), finalize(() => this.isGettingUsers = false))
      .subscribe((res) => {
        this.users = res;
        if (this.users.findIndex((user) => user.id === this.form.controls['assginee'].value) === -1) {
          this.form.controls['assginee'].reset();
          this.form.controls['assginee'].updateValueAndValidity();
        }
      });
  }

  private getLookups() {
    this.loading = true;
    const sector = this.httpHandlerService.get(Config.FollowUp.GetMyHirerchy);
    const hirerchy = this.httpHandlerService.get(Config.FollowUp.GetMyHirerchy);
    const commitee = this.httpHandlerService.get(Config.Committees.GetAllActive);
    forkJoin({sector, hirerchy, commitee})
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntil(this.endSub$)
      )
      .subscribe((res: any) => {
        this.sector = res.hirerchy;
        this.commitee = res.commitee;
        if (!!this.editedItem) {
          this.setItemVals();
        }
      });
  }

  handleLangChange() {
    this.translateService.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe((language) => {
        this.lang = language.lang;
        if (!this.editedItem) {
          this.form.get('type').setValue(0);
        }
      });
  }

  private setItemVals() {
    this.isEditMode = this.editedItem.isCloneClicked ? false : true;
    this.loading = true;
    this.httpHandlerService
      .get(`${Config.meetings.actionItems.getById}/${this.editedItem.id}`)
      .pipe(takeUntil(this.endSub$), finalize(() => this.loading = false))
      .subscribe((item) => {
        this.fullDetailsItem = item;
        const body = {
          type: item.committeeId ? 1 : 0,
          action: item.action,
          assginee: item.assginee,
          topic: item.topic,
          dueDate: item.dueDate,
          sector: item?.sectorId,
          department: item?.departmentId,
          section: item?.sectionId,
          commitee: item.committeeId
        };
        this.prevUploadedFiles = item?.attachments
        this.form.patchValue(body);
        if (item.committeeId) {
          this.getMembers();
        }
        this.isFirstEditMode = true;
        setTimeout(() => {
          if (item?.departmentId) this.getUsers(item?.departmentId)
          if (item?.sectionId) this.getUsers(item?.sectionId)
        }, 100);
        setTimeout(() => {
          this.form.get("assginee").setValue(item.assginee)
        }, 700);
      });
  }

  getMembers() {
    if(this.form.get('commitee').value) {
      if (!this.editedItem) {
        this.form.get('assginee').setValue(null);
      }
      this.httpHandlerService.get(Config.Committees.Members + this.form.get('commitee').value).subscribe((res) => {
        this.member = res;
      })
    }
  }

  public uploadFile(evt: any) {
    const formDate = new FormData();
    formDate.append('File', evt[evt.length - 1].file);
    this._http
      .post(Config.apiUrl + Config.fileService.upload, formDate, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.userService.getAccessTokenId()}`,
          'License-Key': licenceKey.valid
        }),
      }).subscribe((res: any) => {
      this.attachments.push({
        extension: res.extension,
        fileName: res.fileName,
        uploadedFileName: res.uploadedFileName
      });
    });
  }

  public deleteAttachment(i) {
    let attachment = this.attachments[i];
    if (attachment)
      this.attachments.splice(i, 1);
  }

  initForm(): void {
    this.form = this.fb.group({
      action: this.fb.control('', Validators.required),
      assginee: this.fb.control('', Validators.required),
      topic: this.fb.control(''),
      dueDate: this.fb.control('', Validators.required),
      sector: this.fb.control(null, [Validators.required]),
      department: this.fb.control(null),
      section: this.fb.control(null),
      type: this.fb.control(0, [Validators.required]),
      commitee: this.fb.control(null),
      attachments: this.attachments
    });
    this.handelSelectSerctor();
    this.handelSelectDepartments();
    this.handelSelectSections();
    this.handelSelectType();
  }

  handelSelectType() {
    this.form.get('type').setValue(0);
    this.form.get('type').valueChanges.subscribe(data => {
      this.form.get('section').reset();
      this.form.get('assginee').reset();
      this.form.get('sector').reset();
      this.form.get('department').reset();
      this.form.get('commitee').reset();
      if (data == 0) {
        this.form.get('sector').setValidators([Validators.required]);
        this.form.get('commitee').clearValidators();
        this.form.get('commitee').updateValueAndValidity();
        this.form.get('sector').updateValueAndValidity();
      } else {
        this.form.get('commitee').setValidators([Validators.required]);
        this.form.get('commitee').updateValueAndValidity();
        this.form.get('sector').clearValidators();
        this.form.get('sector').updateValueAndValidity();
      }
    })
  }

  handelSelectSerctor() {
    const sector = this.form.get('sector');
    sector.valueChanges.pipe(takeUntil(this.endSub$)).subscribe((value) => {
     // if (!value) return;
      this.form.get('department').setValue(null);
      this.handelFindDepartments(value);
    });
  }

  handelFindDepartments(sectorid: number) {
    const sector = this.sector.find((sector) => sectorid == sector.id);
    this.department = sector?.departments || [];
    if (!this.form.get('department').value) {
      this.getUsers(sectorid);
    }
  }

  handelFindSections(departmentid: number) {
    const department = this.department.find(department => departmentid == department.id);
    this.section = department?.sections || [];
    let groupId = departmentid ? departmentid : this.form.get('sector').value

    if(!this.form.get('section').value) {
        this.getUsers(groupId);
      // this.getUsers(departmentid);
    }
  }

  handelSelectDepartments() {
    const department = this.form.get('department');
    department.valueChanges.pipe(takeUntil(this.endSub$)).subscribe((value) => {
      // if (!!value) this.getUsers(value);
      // else this.getUsers(this.form.get('sector').value)

      //if (!value) return;
      this.form.get('section').setValue(null);
      this.handelFindSections(value);

    });
  }

  handelSelectSections() {
    const section = this.form.get('section');
    section.valueChanges.subscribe(value => {
      //if (!!value) this.getUsers(value);
      let groupId = value ? value : 
      this.form.get('department').value ? this.form.get('department').value : this.form.get('sector').value
      this.getUsers(groupId);
    })
  }

  addActionItems() {

    if (this.form.invalid) return;
    this.isBtnLoading = true;
    if (this.isEditMode) this.updateActionItem();
    else {
      const sector = this.form.get('sector').value;
      const department = this.form.get('department').value;
      const section = this.form.get('section').value;
      const commitee = this.form.get('commitee').value;
      const relatedTo = this.form.get('type').value == 0 ? 1 : 2;
      const body = {
        meetingId: this.createdMeetingId,
        relatedTo: relatedTo,
        ...this.form.value,
        groupId: commitee || section || department || sector,
        attachments: this.attachments
      };

      let dueDate = body.dueDate;
      if (typeof dueDate == "string") {
        dueDate = new Date(dueDate);
        dueDate.setHours(23, 59, 0);
        dueDate = dueDate.toISOString();
      }

      body.dueDate = dueDate;

      this.httpHandlerService
        .post(Config.meetings.actionItems.create, body)
        .pipe(
          finalize(() => (this.isBtnLoading = false)),
          takeUntil(this.endSub$)
        )
        .subscribe((res) => {
          this.closePopup();
          this.form.reset();
          this.save.emit({
            ...body,
            assgineeInfo: res.assgineeInfo,
            id: res.id,
            status: res.status,
            response: res.response,
            typeCode: res.meetingType,
            typeAr: res.meetingTypeAr,
            code: res.code
          });
        });
    }
  }

  private updateActionItem() {
    const sector = this.form.get('sector').value;
    const department = this.form.get('department').value;
    const section = this.form.get('section').value;
    const commitee = this.form.get('commitee').value;
    const relatedTo = this.form.get('type').value == 0 ? 1 : 2;
    const body = {
      meetingId: this.createdMeetingId,
      id: this.editedItem.id,
      relatedTo: relatedTo,
      ...this.form.value,
      groupId: commitee || section || department || sector,
      attachments: this.prevUploadedFiles?.length > 0 ? [...this.attachments, ...this.prevUploadedFiles] : [...this.attachments]
    };
    let dueDate = body.dueDate;
    if (typeof dueDate == "string") {
      dueDate = new Date(dueDate);
      dueDate.setHours(23, 59, 0);
      dueDate = dueDate.toISOString();
    }
    body.dueDate = dueDate;

    this.httpHandlerService
      .put(Config.meetings.actionItems.update, body)
      .pipe(
        finalize(() => (this.isBtnLoading = false)),
        takeUntil(this.endSub$)
      )
      .subscribe((res) => {
        this.closePopup();
        this.form.reset();
        this.update.emit({...body, assgineeInfo: res.assgineeInfo});
      });
  }

  closePopup() {
    this.modelService.close();
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.endSub$.next(null);
    this.endSub$.complete();
  }
}
