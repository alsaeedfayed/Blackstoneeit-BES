import { HttpHandlerService } from './http-handler.service';
import { UserService } from './user.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Config } from '../config/api.config';
import { licenceKey } from 'src/license/license';

@Injectable({
  providedIn: 'root'
})
export class AtachmentService {

  constructor(private userService: UserService, private _http: HttpClient, private http: HttpHandlerService) { }


  UploadAllFilesToCloud(attachment: any[]): Observable<any> | Observable<any>[] {
    const uploadedFiles = attachment.map((attachment) => attachment.file);
    const obs$: Observable<any>[] = uploadedFiles.map((file) => {
      const formData = new FormData();
      formData.append('File', file);
      console.log('formm data' , formData)
      return this._http.post(
        Config.apiUrl + Config.fileService.upload,
        formData,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.userService.getAccessTokenId()}`,
            'License-Key' :licenceKey.valid
          }),
        }
      );
    });
    return attachment && attachment.length > 0 ? obs$ : of(null);
  }

  getAttachmentURLs(fileName: string) {
    return this.http.post(Config.fileService.getFilesUrls, [fileName])
  }

  downloadFile(filepath: string) {
    return this._http.get(Config.apiUrl + Config.fileService.downloadFile + '?filepath=' + filepath, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.userService.getAccessTokenId()}`,
        'License-Key' :licenceKey.valid
      }),
      responseType: 'blob'
    })
  }

}
