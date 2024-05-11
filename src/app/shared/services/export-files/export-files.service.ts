import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { licenceKey } from 'src/license/license';

@Injectable({
  providedIn: 'root'
})
export class ExportFilesService {

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  public exportData(reqType, url, filename, body = {}): Promise<any> {
    let data;
    if (reqType == 'POST' || reqType == 'post') {
      data = {
        headers: {
          Authorization: 'Bearer ' + this.userService.getAccessTokenId(),
          'Content-Type': 'application/json',
          'License-Key': licenceKey.valid,
          'Accept-Language': this.translate.currentLang
        },
        method: reqType,
        body: JSON.stringify(body),

      }
    } else {
      data = {
        headers: {
          Authorization: 'Bearer ' + this.userService.getAccessTokenId(),
          'Content-Type': 'application/json',
          'License-Key': licenceKey.valid,
          'Accept-Language': this.translate.currentLang
        },
        method: reqType,

      }
    }
    return fetch(`${environment.serverUrl}/${url}`, data)
      .then((resp) => resp.blob())
      .then((blob) => {
        if (blob.type.includes('problem')) {
          this.toastr.error(this.translate.instant('shared.errorWithDownload'));
        } else {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          // the filename you want
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        }
      });
  }
}
