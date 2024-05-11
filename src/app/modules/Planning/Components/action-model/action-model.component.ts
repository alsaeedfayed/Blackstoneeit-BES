import { Component, EventEmitter, Input, Output,} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from 'src/app/core/config/api.config';
import { UserService } from 'src/app/core/services/user.service';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { ModelService } from '../../../../shared/components/model/model.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { licenceKey } from 'src/license/license';

@Component({
  selector: 'app-action-model',
  templateUrl: './action-model.component.html',
  styleUrls: ['./action-model.component.scss'],
})
export class ActionModelComponent {
  form: FormGroup = new FormGroup({});
  loading: boolean = false;
  @Input() option: any = {};
  @Output() saveEvent = new EventEmitter()
  attachments: any[] = [];
  lang: string = this.translateService.currentLang;

  constructor(
    private fb: FormBuilder,
    private _http: HttpClient,
    private userService: UserService,
    private httpService: HttpHandlerService,
    private model: ModelService,
    private toastr: ToastrService,
    private translateService:TranslateService
  ) {
    this.form = fb.group({
      comments: this.fb.control('', Validators.required),
    });
  }

  ngOnInit() {
    this.handleLangChange();
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe((language) => {
      this.lang= language.lang;
    });
  }

  public uploadFile(evt: any) {
    const formDate = new FormData();
    formDate.append('File', evt[evt.length-1].file);


    this._http
      .post(Config.apiUrl + Config.fileService.upload, formDate, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.userService.getAccessTokenId()}`,
          'License-Key' :licenceKey.valid
        }),
      })
      .subscribe((res: any) => {
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

  saveAction() {
    this.loading = true;
    const body = {
      performAction: {
        optionId: this.option.id,
        comments: this.form.value.comments,
        attachments: this.attachments,
      },
    };

    this.httpService
      .post(Config.Performance.Perform, body)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.toastr.success(this.translateService.instant('Planning.successfullyDone'));
          this.closeModel();
          this.saveEvent.emit();
        },
        error:()=>{
          this.toastr.error(this.translateService.instant('Planning.somethingWentWrong'))
        }
      });
  }

  closeModel() {
    this.model.close();
  }
}
