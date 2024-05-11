import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ComponentBase} from "src/app/core/helpers/component-base.directive";
import {HttpHandlerService} from "src/app/core/services/http-handler.service";
import {TranslateConfigService} from "src/app/core/services/translate-config.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {AtachmentService} from "../../../../../core/services/atachment.service";
import {ToastrService} from "ngx-toastr";
import {combineLatest} from "rxjs";
import {finalize} from "rxjs/operators";
import {Config} from "../../../../../core/config/api.config";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-add-challenge',
  templateUrl: './add-challenge.component.html',
  styleUrls: ['./add-challenge.component.scss']
})
export class AddChallengeComponent extends ComponentBase implements OnInit {
  addChallengeForm: FormGroup;
  coverImage: any;
  dateError = {
    startDate: false,
    endDate: false,
  }
  lockupsData: any
  items = [
    {id: 1, name: 'Renewable Energy Solutions'},
    {id: 2, name: 'Healthcare Technology'},
    {id: 3, name: 'Sustainable Agriculture'},
    {id: 4, name: 'Education Technology'},
    {id: 5, name: 'Environmental Conservation'},
    {id: 6, name: 'Financial Inclusion'},
  ]
  selectedArea: any = [];
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
        'insertLink',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
      ],
    ],
  };
  sendingLoading: boolean = false;
  language: string;
  //attachments
  uploadedCoverImages: any = [];
  oldCoverAttachments: any = [];
  coverAttachments: any[] = null;
  uploadedAttachments: any = [];
  oldAttachments: any = [];
  Attachments: any[] = null;
  maxFileSizeInMB: number = 2;
  uploadingFile: boolean = false;
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
  focusArea: any = []
  challengeRewardType: any = []
  selectedFocusArea: any = []
  disableAlert = false
  constructor(
    translateService: TranslateConfigService,
    translate: TranslateService,
    private httpSer: HttpHandlerService,
    private router: Router,
    private attachmentService: AtachmentService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    super(translateService, translate);
    // Subscribe to language changes
    this.translate.onLangChange.subscribe((event) => {
      this.language = event.lang;
    });
  }

  ngOnInit(): void {
    this.getLockups()
    this.initChallengeForm()
  }

  initChallengeForm() {
    this.addChallengeForm = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(100)]],
      content: [null, Validators.required, Validators.maxLength(500)],
      focusArea: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      related_points: [null, Validators.required],
      reward_type: [null, Validators.required],
      award_certification: [null],
      amount: [null],
    })
  }

  get formGroup() {
    return this.addChallengeForm;
  }

  get addFormControls() {
    return this.addChallengeForm.controls;
  }

  setFocusAreaValues(value) {
    if (this.selectedFocusArea.includes(value)) {
      this.selectedFocusArea = this.selectedFocusArea.filter((item) => item !== value);
    } else {
      this.selectedFocusArea.push(value);
    }
    console.log(this.selectedFocusArea);
  }

  public saveChallenge(isPublished: boolean) {
    const formDataObject = {
      title: this.addFormControls.title.value,
      coverImage: this.coverImage,
      description: this.addFormControls.content.value,
      startDate: this.convertDateToISo(this.addFormControls.startDate.value),
      focusArea: JSON.stringify(this.selectedFocusArea),
      endDate: this.convertDateToISo(this.addFormControls.endDate.value),
      relatedPoints: this.addFormControls.related_points.value,
      rewardType: this.addFormControls.reward_type.value,
      amount: this.addFormControls.amount.value,
      awardCertification: this.addFormControls.award_certification.value,
      attachments: JSON.stringify(this.Attachments),
      publish: isPublished
    };
    this.addChallenge(formDataObject);
  }

  convertDateToISo(date: NgbDate) {
    return new Date(date.year, date.month - 1, date.day).toISOString()
  }

  selectArea(items) {
    console.log(this.formGroup.value)
  }

  private validateFileType(file: File) {
    if (this.supportedAttachmentTypes.includes(file.type)) {
      return true;
    }
    this.toastr.error(this.translate.instant('shared.fileTypeErrMsg'));
    return false;
  }

  private validateFileSize(file: File): boolean {
    if (file.size < this.maxFileSizeInMB * 1024 * 1024) {
      return true;
    }
    this.toastr.error(this.translate.instant('shared.fileSizeErrMsg'));
    return false;
  }

  //attachment functions
  onUploadCoverImage(e, _files = null) {
    const inputElement = e.target as HTMLInputElement;
    let files: FileList | null = inputElement.files;
    console.log(files[0])
    if (_files)
      files = _files;

    if (files?.length > 0) {
      this.uploadingFile = true;

      if (this.validateFileSize(files[0]) && this.validateFileType(files[0])) {
        //check duplicated file (new or old)
        if (
          this.uploadedCoverImages.filter(
            (item) => files[0].name === item.name
          ).length === 0 && this.oldCoverAttachments.filter(
            (item) => files[0].name === item.name
          ).length === 0
        ) {
          //save the file in this format to show it in preview and to be sent to the server
          let file = {
            file: files[0],
            name: files[0].name,
            size: files[0].size,
            extension: files[0].name.split('.').pop(),
          };
          this.uploadedCoverImages.push(file);
          //send the upload file request
          combineLatest(this.attachmentService.UploadAllFilesToCloud([file]))
            .pipe(finalize(() => {
              this.uploadingFile = false;
            }))
            .subscribe(
              data => {
                //push into array of files to be  with the new decision request
                if (this.coverAttachments == null) this.coverAttachments = [];
                this.coverAttachments.push(data[0]);
                this.coverImage = data[0];
                this.toastr.success(this.translate.instant('shared.documentWasSuccessfullyAdded'));
              });
        } else {
          this.uploadingFile = false;
          this.toastr.error(this.translate.instant('shared.validations.fileAlreadyUploaded'));
        }
      }
    }
  }

  onViewLocalCoverImage(i, type: string) {
    if (type.includes('old')) {
      this.attachmentService.getAttachmentURLs(this.oldCoverAttachments[i].fileName).subscribe(r => {
        window.location.href = r[0].fileUrl;
      })
    } else {
      let file = this.coverAttachments[i];
      const reader = new FileReader();
      reader.readAsDataURL(file.file);

      reader.onload = function (e) {
        const link = document.createElement("a");
        link.href = e.target.result.toString();
        link.download = file.name;
        link.click();
        link.remove();
      }
    }
  }

  // drag drop events
  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    // Remove any drag-over styles
  }

  // drag drop events
  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    // Add styles to indicate the drag-over state (e.g., change background color)
    event.dataTransfer.dropEffect = 'copy'; // Set the cursor icon
  }

  // drop event
  onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    // Remove any drag-over styles

    const files = event.dataTransfer.files;
    console.log('ee')
    this.onUploadCoverImage(event, files);
  }

  onDeleteFile(i, type: string) {
    // TODO when delete request is created
    if (type == 'new') {
      this.uploadedCoverImages.splice(i, 1);
      this.coverAttachments.splice(i, 1);
    } else {
      this.oldCoverAttachments.splice(i, 1);
    }
    this.toastr.success(this.translate.instant('shared.removed'));
    //when confirmation model
    //'shared.deleteDocumentConfirmationMsg'
  }

  onUploadAttachments(e, _files = null) {
    const inputElement = e.target as HTMLInputElement;
    let files: FileList | null = inputElement.files;
    if (_files)
      files = _files;

    if (files?.length > 0) {
      this.uploadingFile = true;

      if (this.validateFileSize(files[0]) && this.validateFileType(files[0])) {
        //check duplicated file (new or old)
        if (
          this.uploadedAttachments.filter(
            (item) => files[0].name === item.name
          ).length === 0 && this.oldAttachments.filter(
            (item) => files[0].name === item.name
          ).length === 0
        ) {
          //save the file in this format to show it in preview and to be sent to the server
          let file = {
            file: files[0],
            name: files[0].name,
            size: files[0].size,
            extension: files[0].name.split('.').pop(),
          };
          this.uploadedAttachments.push(file);
          console.log(this.uploadedAttachments)
          //send the upload file request
          combineLatest(this.attachmentService.UploadAllFilesToCloud([file]))
            .pipe(finalize(() => {
              this.uploadingFile = false;
            }))
            .subscribe(
              data => {
                //push into array of files to be  with the new decision request
                if (this.Attachments == null) this.Attachments = [];
                this.Attachments.push(data[0]);
                console.log(this.Attachments)
                this.toastr.success(this.translate.instant('shared.documentWasSuccessfullyAdded'));
              });
        } else {
          this.uploadingFile = false;
          this.toastr.error(this.translate.instant('shared.validations.fileAlreadyUploaded'));
        }
      }
    }
  }

  onViewLocalAttachments(i, type: string) {
    if (type.includes('old')) {
      this.attachmentService.getAttachmentURLs(this.oldAttachments[i].fileName).subscribe(r => {
        window.location.href = r[0].fileUrl;
      })
    } else {
      let file = this.Attachments[i];
      const reader = new FileReader();
      reader.readAsDataURL(file.file);

      reader.onload = function (e) {
        const link = document.createElement("a");
        link.href = e.target.result.toString();
        link.download = file.name;
        link.click();
        link.remove();
      }
    }
  }

  // drop event
  onDropAttachments(event) {
    event.preventDefault();
    event.stopPropagation();
    // Remove any drag-over styles

    const files = event.dataTransfer.files;
    this.onUploadAttachments(event, files);
  }

  onDeleteAttachments(i, type: string) {
    // TODO when delete request is created
    if (type == 'new') {
      this.uploadedAttachments.splice(i, 1);
      this.Attachments.splice(i, 1);
    } else {
      this.oldAttachments.splice(i, 1);
    }
    this.toastr.success(this.translate.instant('shared.removed'));
    //when confirmation model
    //'shared.deleteDocumentConfirmationMsg'
  }

  getLockups() {
    const queryServiceDesk = {ServiceName: 'Innovation'};
    this.httpSer
      .get(`${Config.Lookups.lookupService}`, queryServiceDesk)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        console.log(res)
        if (res) {
          this.lockupsData = res
          this.focusArea = this.getLookupResult('ChallengeFocusArea')
          this.challengeRewardType = this.getLookupResult('ChallengeRewardType')
          console.log(this.focusArea, this.challengeRewardType)
        }
      });
  }

  getLookupResult(lookupType) {
    const result = this.lockupsData.find(item => item.lookupType === lookupType);
    return result ? result.lookupResult : null;
  }

  checkStartDate(dateType) {
    if ((this.addFormControls.startDate.value && this.addFormControls.endDate.value) !== null) {
      if (this.convertDateToISo(this.addFormControls.startDate.value) > this.convertDateToISo(this.addFormControls.endDate.value)) {
        this.dateError[dateType] = true
        this.disableAlert = false
      } else {
        this.dateError['startDate'] = false
        this.dateError['endDate'] = false

        this.disableAlert = true
      }
    }
  }

  addChallenge(body) {
    this.sendingLoading = true
    this.httpSer
      .post(`${Config.Innovation.challenge.add}`, body)
      .pipe(
        finalize(() => {
          this.sendingLoading = false
        })
      )
      .subscribe(res => {
        console.log(res)
        if (res) {
          this.toastr.success(this.translate.instant(this.alertSuccess(body.publish)));
        }
      });
  }

  alertSuccess(type) {
    return type == true ? 'challenges.success.message' : 'challenges.draft.message';
  }
}
