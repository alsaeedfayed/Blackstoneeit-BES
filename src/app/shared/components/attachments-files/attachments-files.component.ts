import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, OnChanges} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs/operators';
import {Config} from 'src/app/core/config/api.config';
import {UserService} from 'src/app/core/services/user.service';
import {TranslateService} from '@ngx-translate/core';
import {licenceKey} from 'src/license/license';

@Component({
  selector: 'app-attachments-files',
  templateUrl: './attachments-files.component.html',
  styleUrls: ['./attachments-files.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AttachmentsFilesComponent,
      multi: true,
    },
  ],
})
export class AttachmentsFilesComponent implements ControlValueAccessor, OnInit, OnChanges {

  uploadedFiles: any = [];
  @ViewChild("fileUpload") uploadInput: ElementRef;
  @Output() attachmentUploadEvent: EventEmitter<any> = new EventEmitter();
  private onChange = (value: string) => {
  };
  private onTouched = () => {
  };
  public lang = this.translate.currentLang;

  get isRequired() {
    return this.control?.hasValidator(Validators.required);
  }

  @Input() control: FormControl | undefined;
  @Input() title: string = '';
  @Input() disabled: boolean = false;
  @Input() accept;
  @Input() maxSize: number = 0;
  @Input() hint: string = null;
  uplodFileId: number = Math.random();
  attachments: any = [];
  loading: boolean = false;
  _prevAttachment: any[] = [];
  @Input() set prevAttachment(_prevAttachment) {
    this._prevAttachment = _prevAttachment;
  }

  constructor(private toastr: ToastrService, private _http: HttpClient, private userService: UserService, private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.handleLangChange();
  }

  ngOnChanges() {
    if (this.accept && Array.isArray(this.accept)) {
      this.accept = this.accept.join(',');
    }
  }

  private handleLangChange() {
    this.translate.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  writeValue(obj: any): void {
    // this.value = obj;
    // this.onChange(obj);
    if (obj?.[0]?.fileName) {
      this.uploadedFiles = obj?.map(file => {
        if (!!file?.fileName)
          file.name = file.fileName
        return file
      })
    }
    this.attachments = [...this.uploadedFiles]
  }

  log() {
    // console.log(this.control.value)
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

  onUploadFile(e) {
    const extension = e.target.files[0].name.split('.').pop();
    const size = (e.target.files[0].size / (1024 * 1024)).toFixed(2);

    if (!!this.accept && this.accept.toLowerCase().includes(extension.toLowerCase()) && Number(size) <= this.maxSize) {
      if (
        this.uploadedFiles?.filter((item) => e.target.files[0].name === item.name)
          .length === 0
      ) {
        this.uploadedFiles.push({
          file: e.target.files[0],
          name: e.target.files[0].name,
          size: size,
          extension: extension,
        });
        this.uploadFile(this.uploadedFiles)
      } else {
        this.toastr.error(this.translate.instant('shared.validations.fileAlreadyUploaded'));
      }
    } else {
      if (!this.accept.toLowerCase().includes(extension.toLowerCase())) {
        this.toastr.error(this.translate.instant('shared.validations.notSupportedExtension'));
      } else {
        this.toastr.error(this.translate.instant('shared.validations.fileSizeBig'));
      }
    }
  }

  public uploadFile(evt: any) {
    const formDate = new FormData();
    formDate.append('File', evt[this.uploadedFiles.length - 1]?.file);
    evt[this.uploadedFiles.length - 1].loading = true;
    this._http
      .post(Config.apiUrl + Config.fileService.upload, formDate, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.userService.getAccessTokenId()}`,
          'License-Key': licenceKey.valid
        }),
      }).pipe(finalize(() => {
      evt[this.uploadedFiles.length - 1].loading = false;
      (this.uploadInput.nativeElement as HTMLInputElement).value = null;
    }))
      .subscribe((res: any) => {
        this.attachments.push(res);
        this.onChange(this.attachments);
        this.attachmentUploadEvent.emit(this.attachments);
      });
  }

  onViewLocalFile(i) {
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

  onDeleteFile(i) {
    this.uploadedFiles.splice(i, 1)
    this.attachments.splice(i, 1)
    if (this.attachments.length == 0) {
      this.attachmentUploadEvent.emit(null);
      return this.onChange(null);
    }
    this.onChange(this.attachments);
    this.attachmentUploadEvent.emit(this.attachments);
  }

  onDeletePrevFile(i) {
    this._prevAttachment.splice(i, 1)
    if (this._prevAttachment.length == 0) {
      this.attachmentUploadEvent.emit(null);
      return this.onChange(null);
    }
    //this.onChange(this.attachments);
    this.attachmentUploadEvent.emit(this._prevAttachment);
  }

}


