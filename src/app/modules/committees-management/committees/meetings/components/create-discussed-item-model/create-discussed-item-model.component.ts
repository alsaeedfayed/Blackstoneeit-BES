import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { Subject, combineLatest } from 'rxjs';
import { finalize, takeUntil, debounceTime } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AtachmentService } from 'src/app/core/services/atachment.service';
import { ModelService } from 'src/app/shared/components/model/model.service';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { IDiscussedItem } from '../../models/IDiscussedItem';

@Component({
  selector: 'create-discussed-item-model',
  templateUrl: './create-discussed-item-model.component.html',
  styleUrls: ['./create-discussed-item-model.component.scss']
})
export class CreateDiscussedItemModelComponent implements OnInit {

  @Input() discussedItemId = null;
  @Input() meetingId: number;
  @Input() attendees: any[] = [];
  @Output() onCreate = new EventEmitter<boolean>();

  language: string = this.translate.currentLang;

  private endSub$ = new Subject();

  loading: boolean = true;
  isBtnLoading: boolean = false;

  form: FormGroup = new FormGroup({});
  discussedItem: IDiscussedItem;
  isUpdating: boolean = false;
  //employees loading vars
  gettingEmployees: boolean = false;
  searchSubject = new Subject<string>();
  employeeLoadCount: number = 1;
  memberSearchValue: string = '';
  presenters: any[] = [];

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
  //attachments vars
  uploadingFile: boolean = false;
  uploadedFiles: any = [];
  oldAttachments: any = [];
  attachments: any[] = null;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private httpSer: HttpHandlerService,
    private toastr: ToastrService,
    private attachmentService: AtachmentService,
    private modelService: ModelService,
  ) {
    //search for employees
    this.searchSubject.pipe(debounceTime(250)).subscribe((searchTerm: string) => {
      this.employeeLoadCount = 1;
      this.presenters = [];
      // this.getEmployees();
    });
  }

  ngOnInit(): void {
    // handles language change event
    this.handleLangChange();

    // initialize form controls
    this.initFormControls();

    //get discussedItem details
    if (this.discussedItemId) {
      this.isUpdating = true;
      this.getDiscussedItem();
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
  loadingAttendee: boolean = true;

  // initialize form controls
  initFormControls() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(100)]],
      duration: [null, Validators.required],
      presentedBy: [null, Validators.required],
      description: [null],
      attachments: [null],
    });
  }
  //get discussedItem details
  getDiscussedItem() {
    this.httpSer.get(`${Config.DiscussionItem.GetById}/${this.discussedItemId}`)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe((res: IDiscussedItem) => {
        this.discussedItem = res;
        this.form.patchValue(this.discussedItem);
        this.presenters.push(this.discussedItem.presenterInfo);
        this.oldAttachments = this.discussedItem.attachments.map(a => (
          {
            name: a.uploadedFileName,
            extension: a.extension,
            fileName: a.fileName,
            uploadedFileName: a.uploadedFileName
          }
        ));
      })
  }


  // // fetch all employees for members
  // getEmployees() {
  //   this.gettingEmployees = true;
  //   this.httpSer
  //     .get(Config.UserManagement.GetAll, { pageIndex: this.employeeLoadCount, pageSize: 10, fullName: this.memberSearchValue })
  //     .pipe(finalize(() => (this.gettingEmployees = false)))
  //     .subscribe((res) => {
  //       if (res) {
  //         res.data.forEach((emp) => {
  //           let duplicated = false;

  //           //check if duplicated employee exists
  //           for (const e of this.presenters) {
  //             if (e.id == emp.id) {
  //               duplicated = true;
  //               break;
  //             }
  //           }
  //           if (!duplicated) this.presenters.push(emp);
  //         });
  //       }
  //     });
  // }
  // //focus on search bar if members selection
  // onFocus() {
  //   this.memberSearchValue = '';
  //   this.getEmployees();
  // }
  // //search on members selection
  // searchEmployees(value: any) {
  //   if (value.term.trim()) {
  //     this.memberSearchValue = value.term.trim();
  //     this.searchSubject.next(this.memberSearchValue);
  //   }
  // }
  // //load more employees
  // loadMoreEmployees() {
  //   this.employeeLoadCount++;
  //   this.getEmployees();
  // }

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

  onViewLocalFile(i, type: string) {
    if (type.includes('old')) {
      this.attachmentService.getAttachmentURLs(this.oldAttachments[i].fileName).subscribe(r => {
        window.location.href = r[0].fileUrl;
      })
    }
    else {
      let file = this.uploadedFiles[i];
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

  saveNewDiscussedItem() {
    this.isBtnLoading = true;

    if (this.isUpdating) {
      this.updateDiscussedItem();
      return;
    }
    const body = {
      ...this.form.value,
      meetingId: this.meetingId,
      attachments: this.attachments,
    };
    this.httpSer.post(Config.DiscussionItem.Create, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe(res => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeMeetingDetails.discussedItems.discussedItemsModel.createSuccessMsg'));
          this.form.reset();
          this.closePopup();
          this.attachments = null;
          this.uploadedFiles = [];
          this.onCreate.emit(true);
        }
      });
  }

  updateDiscussedItem() {
    this.isBtnLoading = true;

    const body = {
      ...this.form.value,
      id: this.discussedItemId,
      attachments: [...(this.attachments ? this.attachments : []), ...this.oldAttachments],
    };

    this.httpSer.post(Config.DiscussionItem.Update, body)
      .pipe(finalize(() => (this.isBtnLoading = false)))
      .subscribe(res => {
        if (res) {
          this.toastr.success(this.translate.instant('committeeMeetingDetails.discussedItems.discussedItemsModel.updateSuccessMsg'));
          this.form.reset();
          this.closePopup();
          this.attachments = null;
          this.uploadedFiles = [];
          this.onCreate.emit(true);
        }
      });
  }

  closePopup() {
    this.modelService.close();
  }
}
