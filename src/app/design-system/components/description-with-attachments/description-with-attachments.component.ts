import { Component, Input, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-description-with-attachments',
  templateUrl: './description-with-attachments.component.html',
  styleUrls: ['./description-with-attachments.component.scss']
})
export class DescriptionWithAttachmentsComponent implements OnInit {
  // NOT FINAL YET
  // NOT FINAL YET
  // NOT FINAL YET
  // NOT FINAL YET
  // NOT FINAL YET
  @Input() required: boolean = false;
  @Input() title: string = null;

  //attachments vars
  uploadedFiles: any = [];
  oldAttachments: any = [];
  attachments: any[] = null;

  // text editor configuration
  @Input() editorConfig: AngularEditorConfig = {
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
  constructor() { }

  ngOnInit(): void {
  }

  // onUploadFile(e) {
  //   const inputElement = event.target as HTMLInputElement;
  //   const files: FileList | null = inputElement.files;
  //   if (files?.length > 0) {
  //     this.isSaveDraftBtnLoading = true;
  //     this.isPublishBtnLoading = true;

  //     if (this.validateFileSize(e.target.files[0]) && this.validateFileType(e.target.files[0])) {
  //       //check duplicated file (new or old)
  //       if (
  //         this.uploadedFiles.filter(
  //           (item) => e.target.files[0].name === item.name
  //         ).length === 0 && this.oldAttachments.filter(
  //           (item) => e.target.files[0].name === item.name
  //         ).length === 0
  //       ) {
  //         //save the file in this format to show it in preview and to be sent to the server
  //         let file = {
  //           file: e.target.files[0],
  //           name: e.target.files[0].name,
  //           size: e.target.files[0].size,
  //           extension: e.target.files[0].name.split('.').pop(),
  //         };

  //         this.uploadedFiles.push(file);
  //         //send the upload file request
  //         combineLatest(this.attachmentService.UploadAllFilesToCloud([file]))
  //           .pipe(finalize(() => { this.isSaveDraftBtnLoading = false; this.isPublishBtnLoading = false; }))
  //           .subscribe(
  //             data => {
  //               //push into array of files to be  with the new decision request
  //               if (this.attachments == null) this.attachments = [];
  //               this.attachments.push(data[0]);
  //               this.toastr.success(this.translate.instant('shared.documentWasSuccessfullyAdded'));
  //             });
  //       } else {
  //         this.isSaveDraftBtnLoading = false;
  //         this.isPublishBtnLoading = false;
  //         this.toastr.error(this.translate.instant('shared.validations.fileAlreadyUploaded'));
  //       }
  //     }
  //   }
  // }

  // private validateFileSize(file: File): boolean {
  //   if (file.size < this.maxFileSizeInMB * 1024 * 1024) {
  //     return true;
  //   }
  //   this.toastr.error(this.translate.instant('shared.fileSizeErrMsg'));
  //   return false;
  // }

  // private validateFileType(file: File) {
  //   if (this.supportedAttachmentTypes.includes(file.type)) {
  //     return true;
  //   }
  //   this.toastr.error(this.translate.instant('shared.fileTypeErrMsg'));
  //   return false;
  // }

  // onDeleteFile(i, type: string) {
  //   // TODO when delete request is created
  //   if (type == 'new') {
  //     this.uploadedFiles.splice(i, 1);
  //     this.attachments.splice(i, 1);
  //   } else {
  //     this.oldAttachments.splice(i, 1);
  //   }
  //   this.toastr.success(this.translate.instant('shared.removed'));
  // }
}

