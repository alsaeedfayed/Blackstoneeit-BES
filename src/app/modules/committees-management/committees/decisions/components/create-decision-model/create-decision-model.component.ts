import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ToastrService } from 'ngx-toastr';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { concatMap, finalize, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Subject, combineLatest, of } from 'rxjs';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Config } from 'src/app/core/config/api.config';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { IDecision } from '../../models/IDecision';
import { Router } from '@angular/router';

@Component({
  selector: 'create-decision-model',
  templateUrl: './create-decision-model.component.html',
  styleUrls: ['./create-decision-model.component.scss']
})
export class CreateDecisionModelComponent implements OnInit {

  @Input() committeeId: number;
  @Input() decisionId: number;
  @Input() meetingId: number;

  @Output() decisionCreated = new EventEmitter();
  language: string = this.translate.currentLang;

  private endSub$ = new Subject();

  //getting data loading
  loading: boolean = false;
  loadingVotingTemplates: boolean = true;
  loadingWorkgroups: boolean = true;
  loadingDecisionTypes: boolean = true;


  isBtnLoading: boolean = false;
  isSaveDraftBtnLoading: boolean = false;
  isPublishBtnLoading: boolean = false;
  isPublishBtnClicked: boolean = false;
  isUpdating: boolean = false;

  //decision data
  decision: IDecision;
  form: FormGroup = new FormGroup({});
  decisionTypes = [];
  votingTemplates = [];
  workgroups = [];
  employees = [];
  employeeLoadCount: number = 1;
  gettingEmployees = false;
  memberIds: any;
  tags: any

  // text editor configuration
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '150px',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '3',
    sanitize: true,
    outline: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'heading',
        'fontName',
      ],
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
      ],
    ],
  };

  disableVotingTemplate: boolean = false;


  //attachments vars
  maxFileSizeInMB: number = 10;
  supportedAttachmentTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  uploadedFiles: any = [];
  attachments: any[] = null;
  oldAttachments: any = [];
  uploadingFile: boolean = false;
  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
    private toastr: ToastrService,
    private attachmentService: AtachmentService,
    private modelService: ModelService,
    private confirmationPopupService: ConfirmModalService,
    private router: Router
  ) { }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();

    // initialize new meeting form controls
    this.initNewDecisionFormControls();

    // fetch all decision types
    this.getDecisionTypes();

    // fetch all voting templates
    this.getVotingTemplates();

    // fetch all work groups
    this.getWorkgroups();

    if (this.decisionId) {
      this.loading = true;
      this.isUpdating = true;
      this.getDecisionDetails();
    }
  }

  // handles language change event
  private handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // fetch all decision types
  getDecisionTypes() {
    const lookups$ = this.httpSer.get(Config.Lookups.decisionType);

    combineLatest([lookups$]).pipe(
      takeUntil(this.endSub$),
      finalize(() => { this.loadingDecisionTypes = false })
    ).subscribe(([res]) => {
      if (res) {
        this.decisionTypes = res;
      }
    });
  }

  // fetch all voting templates
  getVotingTemplates() {
    this.httpSer
      .get(Config.VotingTemplate.Get)
      .pipe(finalize(() => (this.loadingVotingTemplates = false)))
      .subscribe((res) => {
        if (res) {
          this.votingTemplates = res.data;
        }
      });
  }

  // fetch all work groups
  getWorkgroups() {
    const path = `${Config.WorkGroup.GetListByCommitteeId}/${this.committeeId}`;

    this.httpSer
      .get(path)
      .pipe(finalize(() => (this.loadingWorkgroups = false)))
      .subscribe((res) => {
        if (res) {
          this.workgroups = res.data;
        }
      });
  }

  // get Decision Details
  getDecisionDetails() {
    this.httpSer.get(`${Config.Decision.GetById}/${this.decisionId}`)
      .pipe(finalize(() => { this.loading = false }))
      .subscribe(
        (res: IDecision) => {
          if (res) {
            this.memberIds = res.memberIds;
            this.tags = res.tags.map((tag) => tag.tag);
            this.disableVotingTemplate = res?.disableVotingTemplate;
            res.closingDate = res.decisionVoting?.closingDate ? this.convertUTCDateToLocalDate(res.decisionVoting?.closingDate).toString() : null;
            res.votingTemplate = res.decisionVoting?.votingId ? res.decisionVoting?.votingId : null;
            res.workgroupId = res.decisionWorkgroup?.workgroupId ? res.decisionWorkgroup?.workgroupId : null;
            if (res.memberIds?.length > 0) {
              res.votingType = 0;
              this.getUsersSlice();
            }
            else if (res.workgroupId > 0) {
              res.votingType = 1;
              res.workgroupId = res.decisionWorkgroup.workgroupId;
            }
            this.form.patchValue(res);
            this.form.get('tags').patchValue(res?.tags.map(tag => tag.tag).toString())

            //old attachments
            this.oldAttachments = res.attachments.map(a => (
              {
                name: a.uploadedFileName,
                extension: a.extension,
                fileName: a.fileName,
                uploadedFileName: a.uploadedFileName
              }
            ));

          } else this.goToNotFound();
        });
  }
  // fetch all employees
  getEmployees() {
    this.gettingEmployees = true;

    const path = Config.CommitteesManagement.GetUsers.replace('{id}', `${this.committeeId}`);

    this.httpSer
      .get(path, { pageIndex: this.employeeLoadCount, pageSize: 10 })
      .pipe(finalize(() => (this.gettingEmployees = false)))
      .subscribe((res) => {
        if (res) {
          res.data.forEach((emp) => {
            let duplicated = false;

            //check if duplicated employee exists
            for (const e of this.employees) {
              if (e.id == emp.id) {
                duplicated = true;
                break;
              }
            }
            if (!duplicated) this.employees.push(emp);
          });
        }
      });
  }

  // focus on search bar if members selection
  onFocus() {
    // fetch all employees
    this.getEmployees();
  }

  // load more employees
  loadMoreEmployees() {
    this.employeeLoadCount++;

    // fetch all employees
    this.getEmployees();
  }

  // fetch a slice of users
  getUsersSlice() {
    this.httpSer
      .post(Config.UserManagement.GetUsersByIds, { usersIds: this.memberIds })
      .subscribe((res) => {
        if (res) {
          res.activeUsers.forEach((emp) => {
            let duplicated = false;

            //check if duplicated employee exists
            for (const e of this.employees) {
              if (e.id == emp.id) {
                duplicated = true;
                break;
              }
            }
            if (!duplicated) this.employees.push(emp);
          });
        }
      });
  }

  // initialize form controls
  initNewDecisionFormControls() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(100), EnglishLettersAndNumbersWithComma()]],
      nameAr: [null, [Validators.required, Validators.maxLength(100), ArabicLettersAndNumbersOnly()]],
      type: [null, Validators.required],
      notes: [null, Validators.required],
      votingTemplate: [null, { disable: this.disableVotingTemplate }],
      closingDate: [null],
      votingType: [0],
      workgroupId: [null],
      memberIds: [null],
      attachments: [null],
      tags: [null],
    });
  }
  public convertUTCDateToLocalDate(date: any) {
    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }
  onUploadFile(e) {
    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;
    if (files?.length > 0) {
      this.uploadingFile = true;

      if (this.validateFileSize(e.target.files[0]) && this.validateFileType(e.target.files[0])) {
        //check duplicated file (new or old)
        if (
          this.uploadedFiles.filter(
            (item) => e.target.files[0].name === item.name
          ).length === 0 && this.oldAttachments.filter(
            (item) => e.target.files[0].name === item.name
          ).length === 0
        ) {
          //save the file in this format to show it in preview and to be sent to the server
          let file = {
            file: e.target.files[0],
            name: e.target.files[0].name,
            size: e.target.files[0].size,
            extension: e.target.files[0].name.split('.').pop(),
          };

          this.uploadedFiles.push(file);
          //send the upload file request
          combineLatest(this.attachmentService.UploadAllFilesToCloud([file]))
            .pipe(finalize(() => { this.uploadingFile = false; }))
            .subscribe(
              data => {
                //push into array of files to be  with the new decision request
                if (this.attachments == null) this.attachments = [];
                this.attachments.push(data[0]);
                this.toastr.success(this.translate.instant('shared.documentWasSuccessfullyAdded'));
              });
        } else {
          this.uploadingFile = false;
          this.toastr.error(this.translate.instant('shared.validations.fileAlreadyUploaded'));
        }
      }else {
        this.uploadingFile = false;
      }
    }
  }

  private validateFileSize(file: File): boolean {
    if (file.size < this.maxFileSizeInMB * 1024 * 1024) {
      return true;
    }
    this.toastr.error(this.translate.instant('shared.fileSizeErrMsg'));
    return false;
  }

  private validateFileType(file: File) {
    if (this.supportedAttachmentTypes.includes(file.type)) {
      return true;
    }
    this.toastr.error(this.translate.instant('shared.fileTypeErrMsg'));
    return false;
  }

  onDeleteFile(i, type: string) {
    // TODO when delete request is created
    if (type == 'new') {
      this.uploadedFiles.splice(i, 1);
      this.attachments.splice(i, 1);
    } else {
      this.oldAttachments.splice(i, 1);
    }
    this.toastr.success(this.translate.instant('shared.removed'));
    //when confirmation model
    //'shared.deleteDocumentConfirmationMsg'
  }



  get votingTemplate() { return this.form.get('votingTemplate') as FormControl; }
  get closingDate() { return this.form.get('closingDate') as FormControl; }
  get votingType() { return this.form.get('votingType') as FormControl; }
  get workgroupId() { return this.form.get('workgroupId') as FormControl; }
  get memberIdss() { return this.form.get('memberIds') as FormControl; }

  selectTemplate(e) {
    this.onChangeValidation('votingTemplate', e ? true : false);
    this.onChangeValidation('closingDate', e ? true : false)
    this.onChangeValidation('votingType', e ? true : false)

    e ? '' : this.onChangeValidation('memberIdss', false)
    e ? '' : this.onChangeValidation('workgroupId', false);
  }
  selectVoters(e) {
    this.onChangeValidation('memberIdss', e == 0 ? true : false)
    this.onChangeValidation('workgroupId', e == 1 ? true : false);
  }
  onChangeValidation(FormControlName: string, enabled: boolean) {

    if (enabled) {
      this.form.controls[FormControlName].addValidators(Validators.required);
    }
    else {
      this.form.controls[FormControlName].removeValidators(Validators.required);
      (FormControlName != 'memberIdss' && FormControlName != 'workgroupId') && this[`${FormControlName}`].setValue(null);
    }
    this.form.controls[FormControlName].updateValueAndValidity();
  }
  // save decision as draft
  saveDecisionAsDraft() {
    this.isSaveDraftBtnLoading = true;
    this.isPublishBtnLoading = true;


    const body: IDecision = {
      committeeId: this.committeeId,


      // decisionVotings: [{
      //   votingId: this.form.value.votingTemplate,
      //   closingDate: new Date(this.form.value.closingDate).toISOString()
      // }],
      // decisionWorkgroups: [{
      //   workgroupId: this.form.value.workgroupId
      // }],
      ...this.form.value,
      tags: this.form.value.tags ? this.form.value.tags.split(',').map(formTag => ({ tag: formTag })) : [],
      attachments: [...(this.attachments ? this.attachments : []), ...this.oldAttachments],
    };
    if (this.votingTemplate.value) {
      let current = new Date();
      let closeDate = new Date(this.form.value.closingDate);
      body.decisionVotings = [{
        votingId: this.form.value.votingTemplate,
        // closingDate: new Date(this.form.value.closingDate).toISOString(),
        closingDate: new Date(closeDate.getFullYear(),
          closeDate.getMonth(), closeDate.getDate(),
          (12),
          (current.getMinutes()),
          (current.getSeconds())
        ).toISOString()
      }];
      body.decisionWorkgroups = [{
        workgroupId: this.form.value.workgroupId
      }]
    }


    if (body.votingType == 1) body.memberIds = null;
    else if (body.votingType == 0) body.decisionWorkgroups = null;

    if (this.isUpdating) body.id = this.decisionId;
    if (this.meetingId) body.meetingId = this.meetingId;
    delete body.closingDate;
    this.httpSer
      .post(Config.Decision.SaveDraft, body)
      .pipe(
        finalize(() => { this.isSaveDraftBtnLoading = false; }),
        concatMap((res) => {
          this.decisionId = +res.id;
          if (!this.isPublishBtnClicked) {
            this.decisionCreated.emit();
            if (!this.isUpdating) this.toastr.success(this.translate.instant('committeeDecisions.saveSuccessMsg'));
            else this.toastr.success(this.translate.instant('committeeDecisions.editSuccessMsg'));
            this.closePopup();
            return of(null);
          } else {
            return this.httpSer.put(Config.Decision.Publish, { "id": this.decisionId })
          }
        })
      )
      .pipe(finalize(() => {  this.isPublishBtnLoading = false; }))
      .subscribe((res2) => {
        if (res2) {
          this.decisionCreated.emit();
          this.toastr.success(this.translate.instant('committeeDecisions.publishSuccessMsg'));
          this.form.reset();
          this.closePopup();
        }
      });
  }

  // publish decision
  // publishBtn() {
  //   this.confirmationPopupService.open('publish-decision');
  // }

  publish() {
    // this.confirmationPopupService.close('publish-decision');
    this.isPublishBtnClicked = true;
    this.saveDecisionAsDraft();
  }

  closePopup() {
    this.modelService.close();
  }
  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }




}
