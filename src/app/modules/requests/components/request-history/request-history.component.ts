import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { UserService } from 'src/app/core/services/user.service';
import { IUser } from 'src/app/shared/interfaces/iUser.interface';
import { IPerson } from 'src/app/shared/PersonItem/iPerson';
import { IOption } from '../request-details/iOption.interface';
import { licenceKey } from 'src/license/license';

@Component({
  selector: 'app-request-history',
  templateUrl: './request-history.component.html',
  styleUrls: ['./request-history.component.scss'],
})
export class RequestHistoryComponent implements OnInit {

  @Input() options: IOption[];
  @Output() updateReqEvent = new EventEmitter()

  user: IUser;
  personItem: IPerson;
  comment: FormControl = new FormControl('');
  uploadedFiles: any = [];
  attachments: {
    extension: string;
    fileName: string;
  }[] = [];

  isSubmit: boolean;
  lang: string = this.translateService.currentLang;

  constructor(
    private toastr: ToastrService,
    private httpHandlerService: HttpHandlerService,
    private _http: HttpClient,
    private userService: UserService,
    private translateService:TranslateService
  ) {}

  ngOnInit(): void {
    this.handleLangChange();
    this.getProfile();
  }

  private handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang = language.lang;
    });
  }

  getProfile() {
    const userId = this.userService.getCurrentUserId();
    this.httpHandlerService
      .get(Config.Profile.getProfile + '?userId=' + userId)
      .subscribe((res) => {
        this.user = res;
        this.personItem = {
          id: this.user.id,
          name: this.user.fullName,
          image: this.user.profilePicture,
          backgroundColor: '#0075ff',
          isActive: this.user.active,
          position: this.user.position,
        };
      });
  }

  onUploadFile(e) {
    if (
      this.uploadedFiles.find((item) => e.target.files[0].name === item.name)
    ) {
      this.toastr.error(this.translateService.instant('requests.fileWasAlreadyUploaded'));
    } else {
      this.uploadedFiles.push({
        file: e.target.files[0],
        name: e.target.files[0].name,
        size: (e.target.files[0].size / (1024 * 1024)).toFixed(2),
        extension: e.target.files[0].name.split('.').pop(),
      });
      const formDate = new FormData();
      formDate.append('File', e.target.files[0]);
      this._http
        .post(Config.apiUrl + Config.fileService.upload, formDate, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.userService.getAccessTokenId()}`,
            'License-Key': licenceKey.valid
          }),
        })
        .subscribe((res: any) => {
          this.attachments.push({
            extension: res.extension,
            fileName: res.fileName,
          });
        });
    }
  }

  onDeleteFile(i) {
    this.uploadedFiles.splice(i, 1);
  }

  sendAction(option) {
    this.isSubmit = true;
    option.isSubmit = true;
    const body = {
        optionId: option.id,
        comments: this.comment.value?.trim(),
        attachments: this.attachments,
    };
    this.httpHandlerService
      .post(Config.Service.Perform, body)
      .pipe(
        finalize(() => {
          this.isSubmit = false;
          option.isSubmit = false;
        })
      )
      .subscribe((res) => {
        this.toastr.success(this.translateService.instant('requests.successfullyDone'));
        this.attachments = [];
        this.uploadedFiles = [];
        this.comment.setValue('');
        this.options = [];
        this.updateReqEvent.emit()
      });
  }
  
}
