import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, combineLatest, of } from 'rxjs';
import { concatMap, finalize, takeUntil } from 'rxjs/operators';
import { ComponentBase } from 'src/app/core/helpers/component-base.directive';
import { TranslateConfigService } from 'src/app/core/services/translate-config.service';
import { Location } from '@angular/common';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IDecision } from '../../models/IDecision';
import { ToastrService } from 'ngx-toastr';
import { RoutesVariables } from '../../../../routes';
import { EnglishLettersAndNumbersWithComma } from 'src/app/core/helpers/Emglish-letters-Numbers-Comma';
import { ArabicLettersAndNumbersOnly } from 'src/app/core/helpers/Arabic-Letters-And-Numbers-Only.validator';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { TextDirectionsService } from 'src/app/shared/services/text-directions/text-directions.service';

@Component({
  selector: 'app-new-decision',
  templateUrl: './new-decision.component.html',
  styleUrls: ['./new-decision.component.scss']
})

export class NewDecisionComponent extends ComponentBase implements OnInit {

  private endSub$ = new Subject();

  language: string = this.translate.currentLang;

  committeeId: number;

  sendingLoading: boolean = false;
  isPublishBtnClicked: boolean = false;
  isUpdating: boolean = false;

  employeeLoadCount: number = 1;
  gettingEmployees: boolean = false;

  // loading flags
  loadingTypes: boolean = true;
  loadingData: boolean = true;
  loadingVotingTemplates: boolean = true;
  loadingGroups: boolean = true;
  loadingUSers: boolean = true;

  memberIdsList: any;
  form: FormGroup;
  decisionTypes: [] = [];
  votingTemplates: [] = [];
  workgroups: [] = [];
  employees: any[] = [];
  decisionId?: number = null;

  disableVotingTemplate: boolean = false;
  //attachments vars
  uploadedFiles: any = [];
  oldAttachments: any = [];
  attachments: any[] = null;

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
    sanitize: false,
    outline: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'subscript',
        'superscript',
        // 'justifyLeft',
        // 'justifyCenter',
        // 'justifyRight',
        // 'justifyFull',
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

  //tags
  tags: string[] = [];

  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private fb: FormBuilder,
    private location: Location,
    private httpSer: HttpHandlerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private attachmentService: AtachmentService,
    private confirmationPopupService: ConfirmModalService,
    private textDirectionsService: TextDirectionsService,
  ) {
    super(translateService, translate);
  }

  ngOnInit(): void {

    // handles language change event
    this.handleLangChange();
    this.checkIds();
    this.getCommitteeMembers()
  }

  // handles language change event
  handleLangChange() {
    this.translate.onLangChange
      .pipe(takeUntil(this.endSub$))
      .subscribe(() => {
        this.language = this.translate.currentLang;
      });
  }

  // get voting templates
  votingTemplateObj : any;
  getVotingTemplates() {
    this.httpSer
      .get(Config.VotingTemplate.Get)
      .pipe(finalize(() => (this.loadingVotingTemplates = false)))
      .subscribe((res) => {
        if (res) {
          this.votingTemplates = res.data;
          this.votingTemplateObj = res?.data[0]
          //console.log('vt' , this.votingTemplateObj)
        }
      });
  }

  // get committee groups
  getWorkGroups() {
    this.httpSer.get(`${Config.WorkGroup.GetListByCommitteeId}/${this.committeeId}`)
      .pipe(finalize(() => (this.loadingGroups = false)))
      .subscribe((res) => {
        if (res) {
          this.workgroups = res.data;
        }
      });
  }

  // fetch all employees
  // getEmployees() {
  //   this.gettingEmployees = true;
  //   let path = Config.CommitteesManagement.GetUsers.replace('{id}', `${this.committeeId}`);
  //   this.httpSer
  //     .get(path, { pageIndex: this.employeeLoadCount, pageSize: 10 })
  //     .pipe(finalize(() => (this.gettingEmployees = false)))
  //     .subscribe((res) => {
  //       if (res) {
  //         res.data.forEach((emp) => {
  //           let duplicated = false;

  //           //check if duplicated employee exists
  //           for (const e of this.employees) {
  //             if (e.id == emp.id) {
  //               duplicated = true;
  //               break;
  //             }
  //           }
  //           if (!duplicated) this.employees.push(emp);
  //         });
  //       }
  //     });
  // }

  // // focus on search bar if members selection
  // onFocus() {
  //   this.getEmployees();
  // }

  // // load more employees
  // loadMoreEmployees() {
  //   this.employeeLoadCount++;
  //   this.getEmployees();
  // }

  // fetch a slice of users
  // getUsersSlice() {
  //   this.httpSer
  //     .post(Config.UserManagement.GetUsersByIds, { usersIds: this.memberIdsList })
  //     .pipe(finalize(() => { this.loadingUSers = false }))
  //     .subscribe((res) => {
  //       if (res) {
  //         res.activeUsers.forEach((emp) => {
  //           let duplicated = false;

  //           //check if duplicated employee exists
  //           for (const e of this.employees) {
  //             if (e.id == emp.id) {
  //               duplicated = true;
  //               break;
  //             }
  //           }
  //           if (!duplicated) this.employees.push(emp);
  //         });
  //       }
  //     });
  // }

  // initialize new decision form controls
  initNewDecisionFormControls() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(100), EnglishLettersAndNumbersWithComma()]],
      nameAr: [null, [Validators.required, Validators.maxLength(100), ArabicLettersAndNumbersOnly()]],
      type: [null, Validators.required],
      financial: [false, Validators.required],
      notes: [null, Validators.required],
      votingTemplate: [null, { disable: this.disableVotingTemplate }],
      closingDate: [Date.now()],
      votingType: [0],
      workgroupId: [null],
      memberIds: [null],
      attachments: [null],
      tags: [null],
    });
  }

  get votingTemplate() { return this.form.get('votingTemplate') as FormControl; }
  get closingDate() { return this.form.get('closingDate') as FormControl; }
  get votingType() { return this.form.get('votingType') as FormControl; }
  get workgroupId() { return this.form.get('workgroupId') as FormControl; }
  get memberIds() { return this.form.get('memberIds') as FormControl; }

  selectTemplate(e) {
    this.onChangeValidation('votingTemplate', e ? true : false);
    this.onChangeValidation('closingDate', e ? true : false)
    this.onChangeValidation('votingType', e ? true : false)
    e ? '' : this.onChangeValidation('memberIds', false)
    e ? '' : this.onChangeValidation('workgroupId', false);
  }
  selectVoters(e) {
    this.onChangeValidation('memberIds', e == 0 ? true : false)
    this.onChangeValidation('workgroupId', e == 1 ? true : false);
  }
  onChangeValidation(FormControlName: string, enabled: boolean) {

    if (enabled) {
      this.form.controls[FormControlName].addValidators(Validators.required);
    }
    else {
      this.form.controls[FormControlName].removeValidators(Validators.required);
      (FormControlName != 'memberIds' && FormControlName != 'workgroupId') && this[`${FormControlName}`].setValue(null);
    }
    this.form.controls[FormControlName].updateValueAndValidity();
  }
  // back to last page
  backToLastPage() {
    this.location.back();
  }

  // save decision as draft
  saveDecisionAsDraft() {
    this.sendingLoading = true;
    const body: IDecision = {
      committeeId: this.committeeId,
      ...this.form.value,
      tags: this.form.value.tags ? this.form.value.tags.split(',').map(formTag => ({ tag: formTag })) : [],
      attachments: [...(this.attachments ? this.attachments : []), ...this.oldAttachments],
    };
    body.notes = this.textDirectionsService.addDirections(body.notes);
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
    if (body.votingType == 1) {
      body.memberIds = null;
    }
    else if (body.votingType == 0) {
      body.decisionWorkgroups = null;
    }

    body.id = this.decisionId ? this.decisionId : 0;
    if (this.isUpdating) body.id = this.decisionId;

    delete body.closingDate;

    body.decisionVotings = [{
      votingId: this.votingTemplateObj?.id,
      // closingDate: new Date(this.form.value.closingDate).toISOString(),
      closingDate: new Date().toISOString()
    }];

    this.httpSer
      .post(Config.Decision.SaveDraft, body)
      .pipe(
        finalize(() => { this.sendingLoading = false; }),
        concatMap((res) => {
          if (!this.isPublishBtnClicked) {
            if (!this.isUpdating && !body.id) this.toastr.success(this.translate.instant('committeeDecisions.saveDraftSuccessMsg'));
            else this.toastr.success(this.translate.instant('committeeDecisions.editDraftSuccessMsg'));
          }
          this.decisionId = res.id;
          body.id = res.id;
          if (this.isPublishBtnClicked) {
            return this.httpSer.put(Config.Decision.Publish, { "id": this.decisionId })
          } else {
            this.goToDetailsPage();
            return of(null);
          }
        })
      ).subscribe((res2) => {
        if (res2) {
          this.toastr.success(this.translate.instant('committeeDecisions.publishSuccessMsg'));
          this.form.reset();
          this.goToDetailsPage();
        }
      })

  }
  isConfirmationModelOpened: boolean = false
  // publish decision
  publishBtn() {
    this.isConfirmationModelOpened = true;
    this.confirmationPopupService.open('publish-decision');
  }

  publish() {
    this.isConfirmationModelOpened = false;
    this.confirmationPopupService.close('publish-decision');
    this.isPublishBtnClicked = true;
    this.saveDecisionAsDraft();
  }

  checkIds() {
    this.committeeId = +this.route.snapshot.paramMap.get('committeeId');
    if (isNaN(this.committeeId)) {
      this.goToNotFound();
      this.committeeId = null;
    }
    else {
      // handles language change event
      this.handleLangChange();

      // initialize new meeting form controls
      this.initNewDecisionFormControls();

      //load decision types
      this.getDecisionTypes();

      this.getVotingTemplates();

      this.getWorkGroups();

      if (this.router.url.includes('/edit/')) {
        //get id
        this.isUpdating = true;
        this.decisionId = +this.route.snapshot.paramMap.get(`${RoutesVariables.Decision.DecisionId}`);
        //check if fake id
        if (isNaN(this.decisionId)) {
          this.goToNotFound();
          this.decisionId = null;
        }
        else {
          //get decision details
          this.getDetails();
        }
      }
    }
  }

  //loading decision details
  getDetails() {
    this.httpSer.get(`${Config.Decision.GetById}/${this.decisionId}`)
      .pipe(finalize(() => (this.loadingData = false)))
      .subscribe(
        (res: IDecision) => {
          if (res) {
            this.tags = res.tags.map((tag) => tag.tag);

            this.disableVotingTemplate = res.disableVotingTemplate;
            // voters
            //this.memberIdsList = res.memberIds;
          //  if (this.memberIdsList?.length > 0) this.getUsersSlice();

            if (res.decisionVoting) {
              res.closingDate = this.convertUTCDateToLocalDate(res.decisionVoting.closingDate).toString();
              res.votingTemplate = res.decisionVoting.votingId;
              res.workgroupId = res.decisionWorkgroup?.workgroupId;
              if (res.memberIds?.length > 0)
                res.votingType = 0;
              else if (res.workgroupId > 0) {
                res.votingType = 1;
                res.workgroupId = res.decisionWorkgroup.workgroupId;
              }
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
  public convertUTCDateToLocalDate(date: any) {

    let lastDate = new Date(date);
    var newDate = new Date(
      lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000
    );
    return newDate;

    // let lastDate = new Date(date);
    // var hourOffset = lastDate.getTimezoneOffset() / 60;
    // lastDate.setHours(lastDate.getHours() + hourOffset);
    // var newDate = new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000);
    // var offset = lastDate.getTimezoneOffset() / 60;
    // var hours = lastDate.getHours();
    // newDate.setHours(hours - offset);
    // return newDate;
  }

  //get decisions types
  getDecisionTypes() {
    const lookups$ = this.httpSer.get(Config.Lookups.decisionType);

    combineLatest([lookups$])
      .pipe(
        finalize(() => { this.loadingTypes = false }),
        takeUntil(this.endSub$)
      ).subscribe(([res]) => {
        if (res) {
          this.decisionTypes = res;
        }
      });
  }

  goToDetailsPage() {
    let path = `/committees-management/${RoutesVariables.Decision.Details}`.replace(`:${RoutesVariables.Decision.CommitteeId}`, `${this.committeeId}`).replace(`:${RoutesVariables.Decision.DecisionId}`, `${this.decisionId}`);
    this.router.navigateByUrl(path);
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }

  onUploadFile(e) {
    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;
    if (files?.length > 0) {
      this.sendingLoading = true;
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
            .pipe(finalize(() => { this.sendingLoading = false; }))
            .subscribe(
              data => {
                //push into array of files to be  with the new decision request
                if (this.attachments == null) this.attachments = [];
                this.attachments.push(data[0]);
                this.toastr.success(this.translate.instant('shared.documentWasSuccessfullyAdded'));
              });
        } else {
          this.sendingLoading = false;
          this.toastr.error(this.translate.instant('shared.validations.fileAlreadyUploaded'));
        }
      }else {
        this.sendingLoading = false;
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
  }

  gettingCommitteeMembers : boolean = true
  getCommitteeMembers() {
    let path = Config.CommitteesManagement.GetUsers.replace('{id}', `${this.committeeId}`);
    this.httpSer
      .get(path, { pageIndex: 1, pageSize: 1000000000 })
      .pipe(finalize(() => (this.gettingCommitteeMembers = false)))
      .subscribe((res) => {
        if (res) {
          res.data.forEach((emp) => {
            // let duplicated = false;

            // //check if duplicated employee exists
            // for (const e of this.employees) {
            //   if (e.id == emp.id) {
            //     duplicated = true;
            //     break;
            //   }
            // }
            // if (!duplicated)
            this.employees.push(emp);
          });
          this.form.patchValue({ memberIds: this.employees.map(m => m.id) })
        }
      });
  }
}
