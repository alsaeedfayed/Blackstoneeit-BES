import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from './../../../core/services/http-handler.service';

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-description-input-with-attachments',
  templateUrl: './description-input-with-attachments.component.html',
  styleUrls: ['./description-input-with-attachments.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DescriptionInputWithAttachmentsComponent,
      multi: true,
    },
  ],
})
export class DescriptionInputWithAttachmentsComponent
  implements ControlValueAccessor, OnInit, OnDestroy {
  @Output() attachmentUploadEvent: EventEmitter<any> = new EventEmitter();
  @Input() title: string;
  @Input() prevAttachment: any[] = [];
  @Input() isTitle: boolean = true;
  @Input() maxFileSizeInMB: number = 2;
  @Input() supportedType: string[] = [
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
  disabled: boolean = false;
  lang: string = this.translate.currentLang;
  private endSub$ = new Subject();
  value: string = '';
  @Input() control: FormControl | undefined;
  @Input() public set Disabled(val:boolean){
    this.disabled = val;
  }
  @Input() isSubmitted: boolean = false;
  @Input() uploadFilesTitle: string = this.translate.instant('shared.uploadFiles')
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Input() isCommentRequired: boolean = false;
  @Input() isAttchmentRequired: boolean = false;
  @Input() attachmentHint: any;

  private onChange = (value: string) => { };
  private onTouched = () => { };

  constructor(
    private toastr: ToastrService,
    private _http: HttpHandlerService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.handleLangChange();
  }

  handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang= language.lang;
      this.uploadFilesTitle = this.translate.instant('shared.uploadFiles')
    });
  }

  writeValue(obj: any): void {
    if (obj === null) {
      this.uploadedFiles = [];
    }

    this.value = obj;
    this.onChange(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  change() {
    this.onChange(this.value);
  }

  get IsCommentRequired() {
    return this.control?.hasValidator(Validators.required) && this.isCommentRequired;
  }

  get IsAttachmentRequired() {
    return this.isAttchmentRequired;
  }

  
  onUploadFile(e) {
    // debugger
    if (this.validateFileSize(e.target.files[0]) && this.validateFileType(e.target.files[0])) {
      if (
        this.uploadedFiles.filter(
          (item) => e.target.files[0].name === item.name
        ).length === 0
      ) {
        this.uploadedFiles.push({
          file: e.target.files[0],
          name: e.target.files[0].name,
          size: (e.target.files[0].size / (1024 * 1024)).toFixed(2),
          extension: e.target.files[0].name.split('.').pop(),
        });
        this.attachmentUploadEvent.emit(this.uploadedFiles);
      } else {
        this.toastr.error('File was already uploaded');
      }
    }
  }

  public get hintTypes(): string[] {
    let Types: string[] = [];
    if (this.supportedType.some((type) => type.includes('image'))) {
      Types.push('shared.imageFiles');
    }
    if (this.supportedType.some((type) => type.includes('pdf'))) {
      Types.push('shared.pdfFiles');
    }
    if (this.supportedType.some((type) => type.includes('excel'))) {
      Types.push('shared.sheetsFiles');
      Types.push('shared.MsWordsFiles');
    }
    return Types;
  }

  onDeleteFileFromCloud(file: any) { }

  private validateFileSize(file: File): boolean {
    if (file.size < this.maxFileSizeInMB * 1024 * 1024) {
      return true;
    }
    this.toastr.error(this.translate.instant('shared.fileSizeErrMsg'));
    return false;
  }

  private validateFileType(file: File) {
    if (this.supportedType.includes(file.type)) {
      return true;
    }
    this.toastr.error(this.translate.instant('shared.fileTypeErrMsg'));
    return false;
  }

  onViewFile(file: { extension: string; fileName: string }) {
    this._http
      .post(Config.fileService.getFilesUrls, [file.fileName])
      .pipe(takeUntil(this.endSub$))
      .subscribe({
        next: (res: any[]) => {
          if (res && res.length > 0) {
            window.open(res[0].fileUrl);
          }
        },
        error: (err) => {
          this.toastr.error('Something Went Wrong');
        },
      });
  }

  onViewLocalFile(i) {
    let file = this.uploadedFiles[i];
    const reader = new FileReader();
    reader.readAsDataURL(file.file);
    reader.onload = function(e){
      const link = document.createElement("a");
      link.href = e.target.result.toString();
      link.download = file.name;
      link.click();
      link.remove();
    }
  }

  onDeleteFile(i) {
    // resetting file input
    (document.getElementById('input-file') as HTMLInputElement).value = null;
    this.onDelete.emit(i);
    this.uploadedFiles.splice(i, 1);
  }

  ngOnDestroy(): void {
    this.endSub$.next('');
    this.endSub$.complete();
  }
}


